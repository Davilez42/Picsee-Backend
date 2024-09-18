const UserNotFound = require("../exceptions/UserNotFound");
const PostNotFound = require("../exceptions/PostNotFound");
const { v4: uuid } = require('uuid');
const { post } = require("postman-request");

class PostRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async find(postId) {
    const client = await this.pool.connect()
    try {
      const respDb = await client.query(`
        SELECT 
        p.post_id as "postId",
        im.url,
        im.format,
        im.name
        FROM posts p
        JOIN images im on im.post_id = p.post_id
        WHERE p.post_id = $1`, [postId])

      if (respDb.rows <= 0) {
        throw new PostNotFound(postId)
      }
      return respDb.rows[0]
    } catch (error) {
      throw error
    } finally {
      client.release()
    }

  }


  async get(criteria, externalId) {
    const client = await this.pool.connect();
    try {
      const params = []
      const values = []
      let i = 1
      for (const pair of criteria) {
        if (pair[0] === 'query') {
          params.push(`(description = $${i} or t.name ilike '%${pair[1]}%' or us.username ilike '%${pair[1]}%')`)
          values.push(pair[1])
          i += 1
          continue
        }
        if (pair[0] === 'cursor') {
          params.push(`(upload_at < $${i})`)
          values.push(new Date(Number(pair[1])))
          i += 1
          continue
        }
        if (pair[0] === 'tag') {
          params.push(`(t.name = $${i})`)
          values.push(pair[1])
          i += 1
          continue
        }

        if (pair[0] === 'user') {
          params.push(`(us.username = $${i} or us.user_id = $${i})`)
          values.push(pair[1])
          i += 1
          continue
        }
      }

      const query = `
          SELECT 
          p.post_id as id,
          p.description,
          p.upload_at as "uploadAt",
          p.likes,
          json_build_object('id',us.user_id,'username',us.username,'urlAvatar',us.url_avatar)  as author,
          json_build_object('url',img.url,'format',img.format) as image,
          json_agg(t.name) as tags,
          (lk.user_id is not NUll) as liked
          FROM posts p 
          JOIN users us on p.user_id =  us.user_id
          JOIN images img on img.post_id = p.post_id
          LEFT join post_tags pt on pt.post_id = p.post_id
          LEFT join tags t on pt.tag_id = t.tag_id
          LEFT join likes lk on lk.post_id =  p.post_id and lk.user_id = '${externalId}'
          WHERE p.visible = TRUE and us.state = TRUE  and us.deleted = FALSE ${params.length > 0 ? ` and (${params.join(' and ')}) ` : ''}
          GROUP by p.post_id ,us.user_id, us.username, us.url_avatar, img.url, img.format, lk.user_id
          ORDER by p.upload_at DESC 
          LIMIT 15`
      // console.log(query);
      const respDb = await client.query(query, values)
      return respDb.rows;

    } catch (error) {
      throw error
    } finally {
      client.release()
    }

  };

  async like(postId, userId) {
    const client = await this.pool.connect();
    try {
      const relation = await client.query(
        `SELECT deleted FROM likes  where post_id = $1 and user_id = $2`, [postId, userId]);
      if (relation.rows.length > 0) {
        await Promise.all([
          client.query(
            `UPDATE likes  SET deleted = not deleted where post_id = $1 and user_id = $2`, [postId, userId]),
          client.query(`UPDATE posts SET likes = likes + ${relation.rows[0].deleted ? 1 : -1} WHERE post_id = $1`, [postId])])
      } else {
        await Promise.all([
          client.query(
            `INSERT INTO likes  (post_id, user_id)  values($1, $2); `, [postId, userId]),
          client.query('UPDATE posts SET likes = likes + 1 WHERE post_id = $1', [postId])
        ])
      }

    }
    catch (error) {
      await client.query('ROLLBACK;')
      if (error.code === '23503') {
        if (error.constraint === 'fk_post_id') {
          throw new PostNotFound(postId)
        }
        if (error.constraint === 'fk_user_id') {
          throw new UserNotFound(userId)
        }
      }
      throw error
    } finally {
      client.release();
    }
  };

  async create(userId, posts, tags = []) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN;')

      const currentDate = new Date().toISOString()
      const postToInserted = []
      const imagesToInserted = []
      const tagsToInserted = []
      const relationTagInserted = []

      const tagsFlat = tags.flat(1)
      let allTagsFound = []
      if (tagsFlat.length > 0) {
        const placeholder = new Array(tagsFlat.length).fill('$').map((e, i) => `${e}${i + 1}`)
        allTagsFound = (await client.query(`SELECT tag_id , name FROM tags WHERE name in (${placeholder.join(',')})`, tagsFlat)).rows
      }
      //console.log(allTagsFound);

      for (let i = 0; i < posts.length; i++) {
        const postId = posts[i].postId
        const fileId = posts[i].fileId
        const format = posts[i].format
        const urlImage = posts[i].url
        const imageName = posts[i].name

        postToInserted.push(`('${postId}','${userId}',' ','${currentDate}')`)
        imagesToInserted.push(`('${fileId}','${fileId}','${postId}','${urlImage}' ,'${format}','${imageName}')`)

        const size = tags[i] ? tags[i].length : 0

        for (let j = 0; j < size; j++) {
          const tagFound = allTagsFound.find(t => t.name.toLowerCase() === tags[i][j].toLowerCase())
          if (tagFound) {// Found the tag
            relationTagInserted.push(`('${postId}','${tagFound.tag_id}')`)
          } else {
            const tagId = uuid()
            tagsToInserted.push(`('${tagId}','${String(tags[i][j]).toLowerCase()}')`)
            relationTagInserted.push(`('${postId}','${tagId}')`)
          }
        }
      }

      await Promise.all([
        client.query(`INSERT INTO posts 
            (post_id,user_id,description,upload_at) 
            VALUES ${postToInserted.join(',')}`),

        client.query(`INSERT INTO images 
          (image_id,external_id,post_id,url,format,name) 
          VALUES ${imagesToInserted.join(',')}`),

        tagsToInserted.length > 0 ? client.query(`INSERT INTO tags 
            (tag_id,name) 
            VALUES ${tagsToInserted.join(',')} ON CONFLICT DO NOTHING`) : undefined,

        relationTagInserted.length > 0 ? client.query(`INSERT INTO post_tags 
              (post_id,tag_id) 
              VALUES ${relationTagInserted.join(',')}`) : undefined,
      ])

      await client.query('COMMIT;')

    } catch (error) {
      await client.query('ROLLBACK;')
      throw error
    } finally {
      client.release();
    }
  };

}

module.exports = PostRepository
const UserNotFound = require("../exceptions/UserNotFound");
const PostNotFound = require("../exceptions/PostNotFound");

class PostRepository {
  constructor(pool) {
    this.pool = pool;
  }


  async find(id_post) {
    const dbconnection = await this.pool.connect();
    const resp = await dbconnection.query(`
    SELECT p.id_post,p.description, img.url,img.format
    FROM posts p
    join images img on img.id_post = p.id_post 
    Where p.id_post = $1
    `, [id_post])

    return resp.rows[0]
  }
  async getRelevants() {
    const dbconnection = await this.pool.connect();
    const data = await dbconnection.query(`
                                        SELECT im.url_image
                                        FROM posts p
                                        join images im on  im.id_post = p.id_post
                                        join users us on us.id_user = p.id_user
                                        where p.visible = TRUE  and us.state = TRUE                                         
                                        order by upload_date
                                        limit 20
   `);
    dbconnection.release();
    return data.rows.map(p => p.url_image)

  };

  async get({ tag, expression, cursor, user }) {
    const dbconnection = await this.pool.connect();
    let parameter = '';
    if (tag) {
      parameter += ` and '${tag.toLowerCase()}'= ANY (p.tags)`
    }
    if (expression) {
      parameter += ` and p.description ilike '%${expression.toLowerCase()}%'`
    }
    if (user) {
      parameter += ` and us.username = '${user}'`
    }
    if (cursor) {
      const resp = await dbconnection.query('SELECT upload_date from posts where id_post = $1', [cursor])
      if (resp.rows[0]) {
        parameter += ` and p.upload_date <= '${resp.rows[0].upload_date.toISOString()}'`
      }
    }

    const query = `
          SELECT p.id_post,concat(us.first_name,' ',us.last_name) as author_name,p.description,img.url,img.name,img.format,p.upload_date,avt.url as author_avatar,p.tags, array_agg(distinct psus.id_user) as likes
          FROM posts p 
          join users us on p.id_user =  us.id_user
          join avatars avt on us.id_user =  avt.id_user
          join images img on p.id_post = img.id_post
          left join posts_users psus on psus.id_post =  p.id_post 
          where p.visible = TRUE and us.state = TRUE ${parameter} 
          group by p.id_post,us.first_name,us.last_name,p.description,p.tags,p.upload_date,img.url,img.name,img.format,avt.url
          order by p.upload_date DESC`

    const data = await dbconnection.query(query)
    dbconnection.release()

    return data.rows;
  };

  async setLike(id_post, id_user) {
    const dbconnection = await this.pool.connect();
    const relation = await dbconnection.query(
      `SELECT state FROM posts_users  where id_post = $1 and id_user = $2`, [id_post, id_user]);

    try {
      if (relation.rows.length > 0) {
        await dbconnection.query(
          `UPDATE posts_users  SET state = $3 where id_post = $1 and id_user = $2`, [id_post, id_user, !relation.rows[0].state]);
      } else {

        await dbconnection.query(
          `INSERT INTO posts_users  (id_post, id_user)  values($1, $2); `, [id_post, id_user]);
      }
    }
    catch (e) {
      if (e.code === '23503') {
        if (e.constraint === 'fk_id_post') {
          throw new PostNotFound(id_post)
        }
        if (e.constraint === 'fk_id_user') {
          throw new UserNotFound(id_user)
        }

      }
      throw e
    }
    return dbconnection.release();
  };

  async create(id_user, infoFiles, tags = {}) {
    //create post with postgres transactions
    infoFiles = infoFiles.map(p => `${JSON.stringify(p)}`)
    let _tags = []
    for (const i in tags) {
      _tags[i] = `{${tags[i].join(',')}}`
    }
    const dbconnection = await this.pool.connect();
    const time = new Date()
    const resp = await dbconnection.query(`select insertPost($1, $2, $3, $4)`, [id_user, time, infoFiles, _tags])
    dbconnection.release();
    return resp.rows[0].insertpost
  };

}

module.exports = PostRepository

const DataAlreadyExist = require("../exceptions/DataAlreadyExist");
const UserNotFound = require("../exceptions/UserNotFound");


class UserRepository {
  constructor(pool) {
    this.pool = pool
  }
  async find(user) {
    const dbConnection = await this.pool.connect();
    try {
      const respDb = await dbConnection.query(`SELECT 
        user_id as "userId",
        url_avatar as "urlAvatar",
        username 
        FROM users us
        WHERE us.deleted = FALSE  and (us.username = $1 or us.email = $1 or us.user_id = $1)`, [user])

      if (!respDb.rows[0]) {
        throw new UserNotFound(user)
      }
      return respDb.rows[0];
    } catch (error) {
      throw error
    } finally {
      dbConnection.release();
    }

  };

  async create(user) {
    const client = await this.pool.connect();

    try {
      const respDb = await client.query(
        `INSERT INTO users (user_id,username,first_name,last_name,email,password,url_avatar,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING user_id`,
        [
          user.userId,
          user.username,
          user.firstNames,
          user.lastNames,
          user.email,
          user.password,
          user.urlAvatar,
          new Date().toISOString(),
        ]
      );
      return respDb.rows[0].user_id;
    } catch (e) {
      throw e.code === '23505' ? new DataAlreadyExist(e.constraint.split('idx_')[1]) : e
    }
    finally {
      client.release();
    }
  };

  async delete(userId) {
    const dbConnection = await this.pool.connect();
    try {

      const respDb = await dbConnection.query(`UPDATE users SET deleted = FALSE where user_id = ${userId}`);

      dbConnection.release();

      if (respDb.rowCount === 0) {
        throw new UserNotFound(userId)
      }
    } catch (error) {
      throw error
    } finally {
      dbConnection.release();
    }


  };

  async update(userId, data) {
    const dbConnection = await this.pool.connect()
    try {
      const dataUpdate = []
      for (const k in data) {
        dataUpdate.push(`${k} = '${data[k]}'`)
      }
      const respDb = await dbConnection.query(`UPDATE users SET ${dataUpdate.join(',')} WHERE user_id and deleted = FALSE = $1`, [userId])

      if (respDb.rowCount <= 0) {
        throw new UserNotFound(id_user)
      }

    } catch (error) {
      throw error
    } finally {
      dbConnection.release();
    }
  }

  async findCredentials(user) {
    const dbConnection = await this.pool.connect();
    try {
      const respDb = await dbConnection.query(`
                            SELECT 
                            us.user_id as "userId",
                            us.url_avatar as "urlAvatar",
                            us.username,
                            us.password
                            FROM users us
                            WHERE  (username = $1 or email = $1 or user_id = $1) and (state = TRUE and deleted = FALSE)`, [user]);

      return respDb.rows[0];
    } catch (error) {
      throw error
    } finally {
      dbConnection.release();
    }
  }
}




module.exports = UserRepository
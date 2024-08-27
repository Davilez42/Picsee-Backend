
const DataAlreadyExist = require("../exceptions/DataAlreadyExist");
const UserNotFound = require("../exceptions/UserNotFound");


class UserRepository {
  constructor(pool) {
    this.pool = pool
  }
  async find(user) {
    const dbconnection = await this.pool.connect(); // obtengo una conexion
    const respdb = await dbconnection.query(`SELECT id_user,url,username,password 
                                                from users us
                                                join avatars using(id_user)
                                                WHERE ${isNaN(user) ? '(username = $1 or email = $1)' : '(id_user = $1)'}   and state = TRUE`, [user]);
    dbconnection.release(); //termino de utilizar la conexion
    if (!respdb.rows[0]) {
      throw new UserNotFound(user)
    }
    return respdb.rows[0];
  };

  async create(user) {
    const dbconnection = await this.pool.connect(); // obtengo una conexion
    try {
      const respdb = await dbconnection.query(
        `INSERT INTO users (username,first_name,last_name,email,password,date_created) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id_user`,
        [
          user.username,
          user.first_names,
          user.last_names,
          user.email,
          user.password,
          new Date(),
        ]
      );
      return respdb.rows[0].id_user;
    } catch (e) {
      throw e.code === '23505' ? new DataAlreadyExist(e.constraint.split('idx_')[1]) : e
    }
    finally {
      dbconnection.release(); //termino de utilizar la conexion
    }
  };

  async delete(id_user) {
    const dbconnection = await this.pool.connect(); // obtengo una conexion
    const respdb = await dbconnection.query(`UPDATE users SET state = FALSE  where id_user = ${id_user}`);
    dbconnection.release();
    if (respdb.rowCount === 0) {
      throw new UserNotFound(id_user)
    }
  };

  async update(id_user, data) {
    const dbconnection = await this.pool.connect()
    const dataUpdate = []
    for (const k in data) {
      dataUpdate.push(`${k} = '${data[k]}'`)
    }
    const respdb = await dbconnection.query(`UPDATE users SET ${dataUpdate.join(',')} WHERE id_user = $1`, [id_user])

    if (respdb.rowCount <= 0) {
      throw new UserNotFound(id_user)
    }
  }

  async exist(user) {
    const dbconnection = await this.pool.connect(); // obtengo una conexion
    const respdb = await dbconnection.query(`SELECT id_user,url,username,password 
                                                from users us
                                                join avatars using(id_user)
                                                WHERE  (username = $1 or email = $1) and state = TRUE`, [user]);
    dbconnection.release(); //termino de utilizar la conexion
    return respdb.rows[0];
  }

  async getAvatar(id_user) {
    const dbconnection = await this.pool.connect(); // obtengo una conexion
    const respdb = await dbconnection.query(`SELECT id_avatar,url,id_kitio from avatars
    where id_user = ${id_user}`);
    dbconnection.release();
    if (respdb.rows.length <= 0) {
      throw new UserNotFound(id_user)
    }
    return respdb.rows[0];
  };

  async updateAvatar(id_user, avatar) {
    const dbconnection = await this.pool.connect(); // obtengo una conexion
    const respdb = await dbconnection.query(
      `UPDATE avatars SET url=$1 , id_kitio = $2 WHERE id_user=$3 ;`,
      [avatar.url, avatar.id_kitio, id_user]
    );
    dbconnection.release();
    return respdb;
  };


}




module.exports = UserRepository
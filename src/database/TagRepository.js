class TagRepository {
  constructor(pool) {
    this.pool = pool
  }
  async get() {
    const dbconnection = await this.pool.connect(); // obtengo una conexion
    const data = await dbconnection.query(`
        SELECT tag.id_tag, tag.name
        FROM tags tag
        order by name DESC`);
    dbconnection.release();
    return data.rows;
  };

  async create(idPosts, tags = {}) {
    throw new Error('Not implemented')
  };

}

module.exports = TagRepository






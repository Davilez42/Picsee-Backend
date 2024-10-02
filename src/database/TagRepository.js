class TagRepository {
  constructor(pool) {
    this.pool = pool
  }
  async get() {
    const client = await this.pool.connect();
    const data = await client.query(`
        SELECT tag.tag_id, tag.name
        FROM tags tag
        ORDER BY use DESC
        `);
    client.release();
    return data.rows;
  };

}

module.exports = TagRepository






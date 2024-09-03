
const bcryptjs = require('bcryptjs')

const compare_ = (passwordHash, password) => {
  return bcryptjs.compare(password, passwordHash)
}

const encrypt_ = async (data) => {
  const randomSalt = await bcryptjs.genSalt()
  return await bcryptjs.hash(data, randomSalt)
}

module.exports = {
  encrypt_,
  compare_
}
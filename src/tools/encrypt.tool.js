
const bcryptjs = require('bcryptjs')

const compare_ = (passwordHash, password) => {
  return bcryptjs.compare(password, passwordHash)
}

const hashData = async (data) => {
  const randomSalt = await bcryptjs.genSalt()
  return await bcryptjs.hash(data, randomSalt)
}

module.exports = {
  hashData,
  compare_
}
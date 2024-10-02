const { verify } = require('jsonwebtoken');
const { userRepository } = require('../../../database/dependencies');
const errorHandler = require("../../../tools/errorHandler");
const { hashData } = require('../../../tools/encrypt.tool')

const resetPass = async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.get('Auth')
        const data = verify(token, process.env.JWT_SECRET_RECOVER_PASS)
        const passwordHash = await hashData(password)
        await userRepository.update(data.userId, { password: passwordHash })
        return res.sendStatus(204)
    }
    catch (e) {
        errorHandler(e, req, res)
    }

};

module.exports = resetPass;

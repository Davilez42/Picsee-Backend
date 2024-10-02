const { userRepository } = require('../../../database/dependencies');
const { NodeEmailService } = require('../../../services/email.service');
const { resetPassword } = require('../../../services/emailEnums');
const errorHandler = require("../../../tools/errorHandler");
const { sign } = require('jsonwebtoken')
const { AES } = require('crypto-js')

const sendRecoverPassLink = async (req, res) => {
    try {
        const { email } = req.body;
        const userFound = await userRepository.find(email);
        if (userFound) {
            const token = sign({ userId: userFound.userId, email }, process.env.JWT_SECRET_RECOVER_PASS, { expiresIn: '5m' })
            const tokenEncrypt = AES.encrypt(token, process.env.SECRET_ENCRYPT).toString()
            const tokenUrl = encodeURIComponent(tokenEncrypt)
            void NodeEmailService.sendEmail(email, 'Recuperar', resetPassword(userFound.username, tokenUrl, process.env.URL_REDIRECT_RECOVER_PASS))
        }
        return res.sendStatus(204)
    }
    catch (e) {
        errorHandler(e, req, res)
    }

};

module.exports = sendRecoverPassLink;

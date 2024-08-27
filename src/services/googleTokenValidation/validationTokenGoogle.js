

const { OAuth2Client } = require("google-auth-library")
const TokenGoogleInvalid = require("../../exceptions/TokenGoogleInvalid")

const validateCredentialsGoogle = async (token) => {
    try {
        const client = new OAuth2Client(process.env.ID_CLIENT_GOOGLE)
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.ID_CLIENT
        })
        const data = ticket.getPayload()
        return data
    } catch (err) {
        console.log(err);
        throw new TokenGoogleInvalid
    }
}


module.exports = {
    validateCredentialsGoogle
}
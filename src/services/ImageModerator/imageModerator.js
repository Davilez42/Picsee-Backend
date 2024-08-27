const request = require('postman-request')
const { createReadStream } = require('fs')
const FormData = require('form-data');
const { join } = require('path')
const verify = async (file) => {
    const route = join(__dirname, 'temp/tempPic.jpg')

    await file.mv(route)

    const formData = new FormData();
    formData.append('models', 'nudity-2.0,wad,offensive,face-attributes,gore');
    formData.append('media', createReadStream(route));
    formData.append('api_user', process.env.API_USER_MODERATOR);
    formData.append('api_secret', process.env.API_SECRET_MODERATOR);

    const data = {
        url: 'https://api.sightengine.com/1.0/check.json',
        body: formData,
        headers: formData.getHeaders(),
    }

    return new Promise((resolve, reject) => {
        request.post(data, (err, httpres, body) => {
            if (err) {
                return reject(err)
            }
            const { error, status, nudity, gore, weapon, drugs, medical_drugs, skull } = JSON.parse(body)

            if (error) {
                console.log('moderation service ❌');
                return resolve()
            }
            const porcentages = [nudity.sexual_activity, nudity.sexual_display, nudity.erotica, gore.prob, weapon, drugs, medical_drugs, skull.prob]
            console.log('moderation service ✅');
            porcentages.some(d => d > 0.20) ? reject() : resolve()
        })

    })
}
module.exports = {
    verify
}

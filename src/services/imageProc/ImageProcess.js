const sharp = require('sharp')
class ImageProcessing {

    static async process(images) {
        const imgProc = []
        for (const i in images) {
            const img = images[i]
            //TODO
            imgProc.push(img)
        }

        return imgProc
    }

}

module.exports = ImageProcessing
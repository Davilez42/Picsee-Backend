const sharp = require('sharp')
class ImageProcessing {

    static async process(images) {
        let img_proc = []
        for (const i in images) {
            const img = images[i]
            //TODO
            img_proc.push(img)
        }

        return img_proc
    }

}

module.exports = ImageProcessing
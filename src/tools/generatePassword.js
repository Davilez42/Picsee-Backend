const generatePassword = (size = 15) => {
    const characters = 'abcdefghijklmnñopqurstwyzABCDEFGHIJKLMNÑOPUQRSTWXYZ123456789{}@!$&/()'
    let output = ''
    for (let i = 0; i < size; i++) {
        const indexRandom = Math.floor(Math.random() * characters.length)
        output += characters[indexRandom]
    }
    return output
}

module.exports = generatePassword
const getFormat = (str) => {
    return str.split('.').pop()
}

const getName = (str) => {
    str = str.split(".");
    str.pop()
    return str.join('.')
};
module.exports = {
    getFormat, getName
}
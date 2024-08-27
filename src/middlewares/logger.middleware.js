const fs = require("fs/promises");

const logger = (req, res, next) => {
  require('colors')
  const pet = ` IP: ${req.ip}  METHOD: ${req.method}  ROUTE: ${req.url}`;
  const fecha = new Date().toLocaleDateString().split('/').join('_')
  const hora = new Date().toLocaleTimeString();
  fs.appendFile(
    `./logs/log_${fecha}.txt`,
    `* ${hora} - ${pet}\n`
  ).then((res) => {
    console.log(
      `${hora} IP: ${req.ip.green}  METHOD:${req.method.red}  ROUTE: ${req.url.blue}  [SAVE in log]`);
  });
  next();
};
module.exports = logger;

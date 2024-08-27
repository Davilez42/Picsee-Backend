const routeNotFound = (req, res, next) => {
  return res.status(404).json({ message: 'The route has not found' })
}

const errorHandlerApp = (err, req, res, next) => {
  if (err) {
    console.error(err.stack)
    return res.sendStatus(500)
  }
  next()
}
module.exports = {
  errorHandlerApp,
  routeNotFound
};

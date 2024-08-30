const Router = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const postRoutes = require("./posts.routes");

const routesV1 = Router();


routesV1.get("/", (req, res) => {
  res.json({ message: "Welcome Picsee server" });
});

routesV1.use('/auth', authRoutes);
routesV1.use('/user', userRoutes);
routesV1.use('/post', postRoutes);
routesV1.disable('x-powered-by')

module.exports = routesV1

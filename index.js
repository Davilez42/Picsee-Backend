const app = require("./src/app");
const { SERVER_CONFIG } = require("./configs/config");
require("dotenv");


const PORT = process.env.PORT || SERVER_CONFIG.PORT;
app.listen(PORT, () => {
  console.log(`server on port : ${PORT}`);
});

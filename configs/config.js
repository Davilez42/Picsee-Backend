SERVER_CONFIG = {
  logger: process.env.LOGGER,
  HOST: "localhost",
  PORT: 8000,
};

CONFIG_CORS = {
  origin: true,
  credentials: true,
  exposedHeaders: ['Meta-Data']
};

IMAGE_KIT_CONFIG = {
  publicKey: process.env.PUBLIC_KEY_IMAGEKIT,
  privateKey: process.env.PRIVATE_KEY_IMAGEKIT,
  urlEndpoint: process.env.URL_ENDPOINT_IMAGEKIT,
  images_folder_dest: process.env.IMAGES_FOLDER_DEST,
  avatars_folder_dest: process.env.AVATARS_FOLDER_DEST,
};

module.exports = {
  SERVER_CONFIG,
  CONFIG_CORS,
  IMAGE_KIT_CONFIG,
};

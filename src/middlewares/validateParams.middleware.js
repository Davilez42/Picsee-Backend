const sharp = require("sharp");
const InvalidBody = require("../exceptions/InvalidBody");
const errorHandler = require("../tools/errorHandler");

const isValidPassword = (pass) => {

  if (String(pass).length < 9) {
    throw new InvalidBody(
      "La contraseña debe ser mayor o igual a 9"
    );
  }
}

const isValidEmail = (email) => {
  const regex_ = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex_.test(String(email))) {
    throw new InvalidBody('El correo electronico no es correcto')
  }
}



const validateSign = (req, res, next) => {
  const { user, password } = req.body;
  try {
    if (String(user).trim() === "" || String(password).trim() === '') {
      throw new InvalidBody(
        "Los campos no pueden estar vacios"
      );
    }
    isValidPassword(password)
    next();
  } catch (e) {
    errorHandler(e, req, res)
  }
};

const validateCreateUser = (req, res, next) => {
  const { username, password, email, firstNames, lastNames } = req.body;
  try {

    [username, firstNames, lastNames, email, password].forEach((v) => {
      if (String(v).trim() === "") {
        throw new InvalidBody(
          "Los campos no pueden estar vacios"
        );
      }
    });
    isValidEmail(email)
    isValidPassword(password)
    next();
  } catch (e) {
    errorHandler(e, req, res)
  }
};

const validateUploadPost = async (req, res, next) => {
  try {
    let photos = req.files
    if (!photos) {
      throw new InvalidBody("No se encuentran fotos para subir");
    }
    if (!photos.length) {
      photos = [photos]
    }
    if (photos.length > 5) {
      throw new InvalidBody('Solo se puede un maximo de 5 fotos')
    }
    let sizeTotal = 0
    for (let f of photos) {
      sizeTotal += f.size
      if (!['image/jpg', 'image/png', 'image/jpeg'].includes(f.mimetype)) {
        throw new InvalidBody('Solo debe de subir archivos de tipo jpg, png, jpeg')
      }
      if (sizeTotal > 20000000) {
        throw new InvalidBody('Error: El tamaño supera 20mb')
      }
      const { width, height } = await sharp(f.buffer).metadata()

      if ((width * height) < 1000000) {
        throw new InvalidBody('Error: La imagen debe tener un tamaño mínimo de 1 MP.')
      }
    }
    const { tags } = req.body
    if (tags) {
      const tagsArrayJson = JSON.parse(tags)
      for (let i = 0; i < tagsArrayJson.length; i++) {
        if (!Array.isArray(tagsArrayJson[i])) {
          throw new InvalidBody('Los tags deben de estar en una lista')
        }
      }
      req.body.tags = tagsArrayJson
    }
    next()
  } catch (e) {
    errorHandler(e, req, res)
  }
};


const validateUpdateUser = (req, res, next) => {
  try {
    const keysValids = ['city', 'country', 'firstName', 'lastName']
    const keys = Object.keys(req.body)
    for (let i = 0; i < keys.length; i++) {
      if (!keysValids.includes(keys[i])) {
        throw new InvalidBody('propiedades incorrectas por favor suministre las propiedades correctas')
      }
      if (req.body[keys[i]].trim() === '') {
        throw new InvalidBody('No deben de haber propiedades vacias')
      }
    }
    next()
  } catch (e) {
    errorHandler(e, req, res)
  }
}

const passwordValidation = (req, res, next) => {
  try {
    const { password } = req.body
    isValidPassword(password)
    next()
  } catch (e) {
    errorHandler(e, req, res)
  }
}

const emailValidation = (req, res, next) => {
  try {
    const { email } = req.body
    isValidEmail(email)
    next()
  } catch (e) {
    errorHandler(e, req, res)
  }
}

module.exports = {
  validateSign,
  validateCreateUser,
  validateUploadPost,
  validateUpdateUser,
  passwordValidation,
  emailValidation
};

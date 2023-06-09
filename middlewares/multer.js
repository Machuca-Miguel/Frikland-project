const multer = require('multer');

let uploadImage = (carpeta) => {

const storage = multer.diskStorage({
    destination: `public/images/${carpeta}`
    ,
    filename: function (req, file, cb) {
        // console.log("***************************",file);
      const nuevoNombre = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, nuevoNombre + '-' + file.originalname)
    //   cb(null, file.fieldname + '-' + nuevoNombre)
    }
  })
  
  const upload = multer({ storage: storage }).single("img");

  return upload;
}

module.exports = uploadImage;



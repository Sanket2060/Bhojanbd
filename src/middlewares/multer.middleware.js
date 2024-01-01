import multer from 'multer';


const storage = multer.diskStorage({  //diskStorage used over memory storage
    destination: function (req, file, cb) {
      cb(null, './public/temp')   //callback and where file is stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)     //callback and file name
    }
  })
  
  const upload = multer({ storage: storage })
  //To get knowledge of it: https://github.com/expressjs/multer

  export {upload}

  
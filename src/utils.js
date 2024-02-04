import path from "path"
import { fileURLToPath } from "url"
import passport from "passport"
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import multer from 'multer'
import fs from 'fs'

export const createHash = async password => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password)

export const passportCall = (strategy) => {
    return async(req, res, next)=>{
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}
export const authorization= (role) => {
    return async(req, res, next)=>{
        if(!req.user) return res.status(401).send({error: "Unauthorized"})
        if(req.user.role!= role) return res.status(403).send({error:"No permissions"})
        next()
    }
}
export const transport= nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:'lorenatique911@gmail.com',
        pass:'ahkk kvnp hvqx vnuv'
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fileType = file.fieldname;
      let uploadPath = 'public/files/';
  
      // Determina la carpeta de destino según el tipo de archivo
      switch (fileType) {
        case 'profiles':
          uploadPath += 'profiles/';
          break;
        case 'products':
          uploadPath += 'products/';
          break;
        case 'documents':
          uploadPath += 'documents/';
          break;
        case 'identificacion':
          uploadPath += 'documents/';
          break;
       case 'comprobante_domicilio':
          uploadPath += 'documents/';
          break;
       case 'comprobante_estado_cuenta':
          uploadPath += 'documents/';
          break;
        default:
          uploadPath += 'other/';
          break;
      }
  
      // Crea la carpeta de destino si no existe
      const fullPath = path.join(__dirname, uploadPath);
      console.log(fullPath)
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
  
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const fileType = file.fieldname;
  
      // Genera un nombre único usando el timestamp actual y un número aleatorio
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      const finalFilePath = fileType + '-' + uniqueSuffix + fileExtension;
  
      cb(null, finalFilePath);
    }
  });
export const uploader = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname
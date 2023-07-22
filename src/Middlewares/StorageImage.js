import fs from 'fs/promises'
import path from 'path';
import crypto from 'crypto'
import { promisify } from 'util';

import imageSize from 'image-size';

const getImagesize = promisify(imageSize);

export async function storeImageMiddleware(req, res, next) {
  const photo = req.file; //accedemos al archivo gracias al middleware de multer

  if (!photo) {
    return res.status(400).json({ error: "No hay archivo" });
  }

  const targetDir = "public/img/photos/"; // RUTA DONDE SE VA A ALMACENAR LA FOTO
  const extarr = photo.originalname.split('.');
  const filename = extarr.slice(0, -1).join('.'); // GUARDAR EL NOMBRE DEL ARCHIVO SIN LA EXTENSION
  const ext = extarr[extarr.length - 1]; // SE GUARDA LA EXTENSION JPG 
  const hash = crypto.createHash('md5').update(`${Date.now()}${filename}`).digest('hex') + '.' + ext; // SE CREA UN HASH UNICO GENERADO CON LA FECHA Y EL NOMBRE Y AL FINAL SE AGREGA LA EXTENSION
  const targetFile = path.join(targetDir, hash); // AQUI SE CONCATENA LA RUTA OBJETIVO Y EL HASH

  //hacemos la validacion para que sea un tipo de imagen permitido
  if (!(await isImage(photo.path))) {
    return res.status(400).json({ error: "Tipo de imagen invalida" });
  }

  try {
      fs.rename(photo.path, targetFile); //  renombrar y mover el archivo en un solo paso
    /***photo.path representa la ubicación temporal del
     *  archivo subido por multer, y targetFile es la ruta 
     * completa del archivo de destino que incluye el directorio final
     *  y el nombre del archivo con el hash único generado */

    req.imageHash = hash; // guardamos el hash en req.imageHash
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "error al guardar la imagen" });
  }
}

async function isImage(filePath) {
  try {
    const check = await getImagesize(filePath);
    return !!check; // Si check es null o undefined, devuelve false; de lo contrario, devuelve true
  } catch (error) {
    console.error(error);
    return false;
  }
}



import fs from "fs";
import path from "path";
import multer, { Multer } from "multer";

interface UploadConfigure {
  destination?: string;
  fileName?: string;
  fileSize?: number;
  sizeErrorMessage?: string;
  validTypes: string[];
}

const upload = (configure: UploadConfigure): Multer => {
  const storage = multer.diskStorage({
    destination: configure.destination || "./app/upload/",
    filename: function (req: any, file: any, cb: any) {
      const fn =
        configure.fileName || Date.now() + path.extname(file.originalname);
      cb(null, fn);
    },
  });

  const fileSize = configure.fileSize || 307200;
  const limits = {
    fileSize,
  };

  return multer({
    storage,
    limits,
    fileFilter: function (req: any, file: any, cb: any) {
      const validTypes = configure.validTypes;
      if (validTypes.indexOf(file.mimetype) === -1) {
        return cb({
          message: "the file format is not acceptable",
          field: file.fieldname,
        });
      }

      cb(null, true);
    },
  });
};

export const removeUploadedFiles = (files: any, path: string) => {
  for (let file in files) {
    try {
      fs.unlink(`${path}${files[file][0].filename}`, function (er: any) {
        console.log(er);
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export const clearDir = (dir: string) => {
  fs.readdir(dir, (err, files) => {
    if (err) console.log(err);

    files.forEach((file) => {
      fs.unlink(`${dir}/${file}`, (err) => {
        if (err) console.log(err);
      });
    });
  });
};

export default upload;

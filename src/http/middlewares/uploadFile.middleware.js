const multer = require("multer");
const crypto = require("crypto");
const fs = require("node:fs")

const uplodaFileMiddleware =
  ({ subDir = "", fieldName, ...multerOptions }) =>
  (req, res, next) => {
    if (!subDir) throw new Error("subDir is not set");
    if (!fieldName) throw new Error("fieldName is not set");

    const dist = `public/uploads/${subDir}/${_getCurrentDateFormated()}`;
    if(!fs.existsSync(dist)) fs.mkdirSync(dist, {recursive: true})
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dist);
      },
      filename: function (req, file, cb) {
        const fileName = file.originalname;
        const fileExt = fileName.split(".").pop();
        const randomFileName = crypto.randomBytes(10).toString("hex");
        const newFileName = `${randomFileName}-${Date.now()}.${fileExt}`;
        cb(null, newFileName);
      },
    });

    const upload = multer({ ...multerOptions, storage }).single(fieldName);

    upload(req, res, function (err) {
      if (err) {
        // todo: catch multer errors
        console.log(err);
        return next(err);
      }
      next();
    });
  };

function _getCurrentDateFormated() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}/${month}/${day}`;
}

module.exports = uplodaFileMiddleware;

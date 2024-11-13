import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.fieldname);
  },
});
export const upload = multer({ storage: storage });
// export const categoryPhoto = multer({ storage: storage }).single(
//   "category_photo"
// );
// export const productPhotos = multer({ storage: storage }).array(
//   "product_photos"
// );

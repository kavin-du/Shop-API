import express from "express";
import multer from "multer";

import checkAuth from "../middleware/check-auth";

const router = express.Router();

// fixing to keep original file name
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, './uploads/'); // callback
  },
  filename: (req: any, file: Express.Multer.File, cb: any) => {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // accept
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5, // in bytes, 5mb now
  },
  fileFilter: fileFilter,
});


import * as productsController from '../controllers/products.controller';
import productModel from "../models/product.model";

// '/products' not used here. its handled by the app
router.get('/', productsController.products_get_all);

/*checkAuth should be after the upload, because check auth sends form data
not json Data, so form body will not yet parsed and we cant access req.body.token

body parser only parses json like data, upload() uses multer, check function
*/
// this does not matter, simply put token in the header, so we dont need to parse the body each time authorize
router.post('/', upload.single('productImage'), productsController.products_create_product);
// router.post('/', checkAuth, upload.single('productImage'), productsController.products_create_product);
 
router.get('/:productId', productsController.products_get_product);

router.patch('/:productId', checkAuth, productsController.products_patch_product);

router.delete('/:productId', checkAuth, productsController.products_delete_product);

export default router;
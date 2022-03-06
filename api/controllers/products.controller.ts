import { NextFunction, Request, response, Response } from "express";
import mongoose from "mongoose";
import log from "../logger/logger";

import Product from "../models/product.model";

export const products_get_all = (req: Request, res: Response, next: NextFunction) => {
  Product.find()
  .select("name price _id productImage") // to remove _v in response
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
          name: doc.name,
          price: doc.price, 
          _id: doc.id,
          productImage: doc.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:${process.env.PORT}/products/${doc._id}`
          }
        };
      })
    };
    res.status(200).json(response);
  })
  .catch(err => {
    log.error(err);
    res.status(404).json({
      error: err,
    });
  });
}



export const products_create_product = (req: Request, res: Response, next: NextFunction) => {
  log.info(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file?.path,
  });
  product.save()
  .then((result:any) => {
    log.info(result);
    res.status(201).json({
      message: 'product created successfully',
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          url: `http://localhost:${process.env.PORT}/products/${result._id}`
        }
      }
    });
  })
  .catch((err: any) => {
    log.error(err);
    res.status(500).json({
      error: err,
    });
  });
}


export const products_get_product = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.productId;

  Product.findById(id)
  .select('name price _id productImage')
  .exec()
  .then(doc => {
    log.info('From database: ', doc);
    if(doc) { // null if document not found
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          url: `http://localhost:${process.env.PORT}/products`
        }
      });
    } else {
      res.status(404).json({
        message: 'Not found valid doc for the given id'
      });
    }
  })
  .catch(err => {
    log.error(err);
    res.status(500).json({ error: err });
  });
}

export const products_patch_product = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.productId;
  const updateOps:any = {};
  // maybe can containg one or two update options, only add them
  // because patch is partial update
  // ? but also the request body needs to be changed like below
  // [ {"propName": "price", "value": "18.58"} , {"propName": "name", "value": "new name"}]
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  // $set is a built in method
  Product.updateOne({ _id: id }, { $set: updateOps })
  .exec()
  .then((result) => {
    res.status(200).json({
      message: 'Product updated successfully',
      request: {
        type: 'GET',
        url: `http://localhost:${process.env.PORT}/products/${id}`
      }
    });
  })
  .catch(err => {
    log.error(err);
    res.status(500).json({
      error: err,
    });
  });

}

export const products_delete_product = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
  .exec()
  .then((result) => {
    res.status(200).json({
      message: 'Product deleted',
      request: {
        type: 'POST',
        body: {
          name: 'String',
          price: 'Number',
        }
      }
    });
  })
  .catch((err) => {
    log.error(err);
    res.status(500).json({
      error: err,
    });
  });
}

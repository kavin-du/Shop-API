import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import log from "../logger/logger";

import Order from "../models/order.model";
import Product from "../models/product.model";

export const orders_get_all = (req: Request, res: Response, next: NextFunction) => {
  Order.find()
    .select("_id quantity product")
    .populate("product", "name") // populate the reference, otherwise gives the ref id only
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:${process.env.PORT}/orders/${doc._id}`,
            }
          }
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });

}

export const orders_create_order = (req: Request, res: Response, next: NextFunction) => {
  Product.findById(req.body.productId)
    .then(product => {
      if(!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then(result => {
      log.info(result);
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'GET',
          url: `http://localhost:${process.env.PORT}/orders/${result._id}`,
        },
      });
    })
    .catch(err => {
      log.error(err);
      res.status(500).json({
        error: err,
      });
    });
}

export const orders_get_order = (req: Request, res: Response, next: NextFunction) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then((order) => {
      if(!order) {
        return res.status(404).json({
          message: 'Order not exist',
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: `http://localhost:${process.env.PORT}/orders`,
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
}

export const orders_delete_order = (req: Request, res: Response, next: NextFunction) => {
  Order.remove({ _id: req.params.orderId })
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: `http://localhost:${process.env.PORT}/orders`,
          body: { 
            productId: 'ID',
            quantity: 'Number',
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Order not found',
        error: err,
      });
    });
}
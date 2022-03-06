import express from 'express';

import checkAuth from '../middleware/check-auth';

import * as OrdersController from '../controllers/order.controller'
import router from './auth.route';

// get orders should be authorized too
router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.delete('/', checkAuth, (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted now'
  });
});

router.get('/:orderId', OrdersController.orders_get_order);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

export default router;
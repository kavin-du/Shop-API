import express from "express";

import * as  userController from '../controllers/user.controller';

const router = express.Router();

router.post('/register', userController.user_signup);

export default router;
import express from "express";
import checkAuth from "../middleware/check-auth";
import * as  userController from '../controllers/user.controller';

const router = express.Router();

router.post('/register', userController.user_signup);

router.post('/login', userController.users_login);

router.delete('/:userId', checkAuth, userController.users_delete)

export default router;
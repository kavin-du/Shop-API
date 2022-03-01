import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import User from '../models/user.model';

export const user_signup = (req: Request, res: Response, next: NextFunction) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => { // gives array of users, bcz can have multiple users in db, bcz not the primary key
    if(user.length > 0) {
      return res.status(409).json({
        message: 'User already exists'
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.status(500).json({error: err});
        else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          user.save()
          .then((result: any) => {
            console.log(result);
            res.status(201).json({
              message: 'User created'
            });
          })
          .catch((err: any) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          })
        }
      });
    }
  })

}
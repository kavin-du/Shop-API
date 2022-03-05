import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import 'dotenv/config';

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


export const users_login = (req: Request, res: Response, next: NextFunction) => {
  User.find({ email: req.body.email }) // find gives an array
  .exec()
  .then(users => {
    if(users.length < 1) {
      // 401 unaauthorized, for both email or pwd
      return res.status(401).json({
        message: 'Auth failed'
      });
      // sending 404 not found is not good
      // then attacker can assume no email
    }
    bcrypt.compare(req.body.password, users[0].password, (err, success) => {
      if(err) {
        return res.status(401).json({
          message: 'Auth failed' // same response everywhere, but error should treat differently
        });
      }
      if(success) {
        const token = jwt.sign(
          { // don't pass pwd as payload
            email: users[0].email,
            userId: users[0]._id,
          },
          process.env.JWT_KEY as string,
          {
            expiresIn: '1h'
          }
        );
        return res.status(200).json({
          message: 'Authentication successful',
          token: token,
        });
      }
      return res.status(401).json({
        message: 'Auth failed'
      });
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  })
}

export const users_delete = (req: Request, res: Response, next: NextFunction) => {
  User.remove({ _id: req.params.userId })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'User deleted' // this gives same message for if same user deleted several times
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err,
    });
  })
}
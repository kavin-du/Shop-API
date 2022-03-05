import { NextFunction, Request, Response } from 'express'
import jwt, { decode } from 'jsonwebtoken'

// middleware for checking authentication for protected routes
// like post, patch, del

export default (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] // remove bearer part
    const decoded = jwt.verify(token as string, process.env.JWT_KEY as string);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}
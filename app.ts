import express, {Express, Request, Response, NextFunction} from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app: Express = express();

app.use(morgan('dev'));

app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello shit');
})


export default app;
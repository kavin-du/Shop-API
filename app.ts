import express, {Express, Request, Response, NextFunction} from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import log from "./api/logger/logger";

const app: Express = express();

mongoose.connect('mongodb://user:userpw@localhost:27017/my-db')
    .then(() => {
        log.info('connected to database successfully');
    }, err => {
        log.error(`${err}`);
    })

app.use(morgan('dev'));

app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello shit');
})


export default app;
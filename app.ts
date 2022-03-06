import express, {
  Express,
  Request,
  Response,
  NextFunction,
  request,
} from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import log from "./api/logger/logger";

import authRoutes from "./api/routes/auth.route";
import productRoutes from "./api/routes/products.route";

const app: Express = express();

mongoose.connect("mongodb://user:userpw@localhost:27017/my-db").then(
  () => {
    log.info("connected to database successfully");
  },
  (err) => {
    log.error(`${err}`);
  }
);

app.use(morgan("dev"));

// bodyparser here
app.use(bodyParser.urlencoded({ extended: false })); // only simple bodies, not extended ones
app.use(bodyParser.json());

// handling CORS errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // means any domain/client
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // this is usually sent by browsers to check which methods available
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE");
    return res.status(200).json({}); // prevent going to routes
  }
  next();
});

// general routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: Error = new Error("Not found");
  req.statusCode = 404;
  next(error);
});

// other errors in the files are also passed here
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(req.statusCode || 500); // if app crashes, assign 500
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;

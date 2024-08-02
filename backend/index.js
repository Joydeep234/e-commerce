import express from "express";
import connectDB from "./db.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

dotenv.config({
  path:'./.env'
})

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))




import { router } from "./routes/routes.js";

app.use('/api/woofers',router)

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("server error", err);
  });

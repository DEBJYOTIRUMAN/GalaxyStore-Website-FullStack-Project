import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));

dotenv.config();

const APP_PORT = process.env.PORT || 3000;
async function connectDB() {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB Connected");
}

connectDB().catch(err => console.log(err));

app.use("/", (_req, res) => {
    res.send(`
    <h1>Welcome to Galaxy Store Server🚀</h1>`);
});

app.listen(APP_PORT, () => {
    console.log(`Server Listening on Port ${APP_PORT}`)
})
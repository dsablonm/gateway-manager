import * as dotenv from 'dotenv' 
dotenv.config()
import express from "express";
import mongoose from "mongoose";
import gatewayRouter from "./routes/gateway.js";

const app = express();
app.use(express.json());
app.use("/api/gateway", gatewayRouter);

const port = process.env.PORT || 3000;
mongoose.set('strictQuery', true);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

start();

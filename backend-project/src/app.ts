import "dotenv/config";
import express from "express";
import { testDatabaseConnection } from "./config/databases";
import userRouter from "./routes/userRoutes";
import productRoute from "./routes/productRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }));

app.use(express.json());
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/product", productRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running"
    });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    await testDatabaseConnection();
});


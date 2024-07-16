import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("몽고db연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("포트 3000번 이상 무");
});
// api route
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// 에러
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "서버 에러 발생! 관리자에게 문의하세요.";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

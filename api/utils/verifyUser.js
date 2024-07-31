import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// JWT 토큰을 검증하는 미들웨어 함수
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "수정 권한이 없습니다."));
  }
  // 토큰이 존재하면, 토큰을 검증
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "수정 권한이 없습니다."));
    }
    req.user = user;
    next();
  });
};

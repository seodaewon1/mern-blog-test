import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// 회원가입
export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  // 기본 유효성 검사
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    // return res.status(400).json({ message: "모든 항목을 채워주세요!" });
    next(errorHandler(400, "모든 항목을 채워주세요!"));
  }

  // 패스워드 암호화
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // 데이터 추가
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    // res.json({ message: "회원가입이 실패하였습니다." + error });
    next(error);
  }
};

// 로그인
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "모든 영역을 채워주세요!"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "이메일 존재하지 않습니다."));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "패스워드가 일치히지 않습니다."));
    }

    // 토근 발행
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(validUser);
  } catch (error) {
    next(error);
  }
};

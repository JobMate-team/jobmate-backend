import express from 'express';
//import { pool } from "../db.config.js"
import dotenv from "dotenv";
import authRoutes from "./routers/auth.router.js";

const app = express();
const port = 3000;

dotenv.config();

// 요청 로깅
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 공통 응답
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({
      resultType: "SUCCESS",
      error: null,
      success,
    });
  };

  res.error = ({ status = 400, errorCode = "unknown", reason = null, data = null }) => {
    return res.status(status).json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };
  next();
});

// 미들웨어 설정
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//auth 경로 라우트
app.use("/auth", authRoutes);

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

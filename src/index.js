import express from 'express';
import reviewRouter from "./routers/review.route.js";
import likeRouter from "./routers/like.route.js";
import authRoutes from "./routers/auth.route.js";
import historyRouter from "./routers/history.route.js";
import adminRoutes from "./routers/admin.route.js";
import coachRouter from "./routers/coach.route.js";

import { verifyServiceAccessJWT } from "./middlewares/jwt.middleware.js";

//import { redisClient } from "./config/redis.config.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log("AUTH HEADER >>>", req.headers.authorization);
  next();
});

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

app.use("/reviews", reviewRouter); 
app.use("/reviews", likeRouter);

app.use("/auth", authRoutes); //auth 경로 라우트
app.use("/coach", verifyServiceAccessJWT, coachRouter);
app.use("/history", historyRouter);
app.use("/admin", adminRoutes);


// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  return res.error({
    status: err.statusCode || 500,
    errorCode: err.errorCode || "SERVER_ERROR",
    reason: err.reason || err.message || "서버 오류",
    data: err.data || null
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




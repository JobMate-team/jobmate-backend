import { pool } from "../db.config.js";

export const getAdminStats = async () => {
  // 인기 질문 TOP 5
  const [popularQuestions] = await pool.query(`
    SELECT 
      q.id,
      q.content,
      COUNT(cs.id) AS used_count
    FROM question q
    LEFT JOIN coaching_session cs
      ON q.id = cs.question_id
    GROUP BY q.id
    ORDER BY used_count DESC
    LIMIT 5
  `);

  // 직무별 사용자 분포
  const [jobCategoryDist] = await pool.query(`
    SELECT 
      jc.name AS category,
      COUNT(u.id) AS user_count
    FROM job_category jc
    LEFT JOIN user u 
      ON u.job_category_id = jc.id
    GROUP BY jc.id
  `);

  // 이번달 / 지난달 코칭 수
  const [[currentCoaching]] = await pool.query(`
    SELECT COUNT(*) AS count
    FROM coaching_session
    WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
  `);

  const [[lastCoaching]] = await pool.query(`
    SELECT COUNT(*) AS count
    FROM coaching_session
    WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
  `);

  // 증가 명수 계산 (+n / -n 형태)
  const coachingDiff = currentCoaching.count - lastCoaching.count;
  const coachingGrowth =
    coachingDiff > 0 ? `+${coachingDiff}` : `${coachingDiff}`;

  // 신규 사용자 수
  const [[currentNewUsers]] = await pool.query(`
    SELECT COUNT(*) AS count
    FROM user
    WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
  `);

  const [[lastNewUsers]] = await pool.query(`
    SELECT COUNT(*) AS count
    FROM user
    WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
  `);

  const newUserDiff = currentNewUsers.count - lastNewUsers.count;
  const newUserGrowth =
    newUserDiff > 0 ? `+${newUserDiff}` : `${newUserDiff}`;

    // 평균 답변 길이 (AI 피드백 + AI 모델 답변 길이 합)
    const [[avgLength]] = await pool.query(`
    SELECT 
        AVG(
        CHAR_LENGTH(ai_feedback) + 
        CHAR_LENGTH(ai_model_answer)
        ) AS avg_length
    FROM coaching_session
    WHERE ai_feedback IS NOT NULL 
        AND ai_model_answer IS NOT NULL
    `);


  // 최근 6개월 월별 코칭 / 후기 수
  const [monthlyCoaching] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      COUNT(*) AS count
    FROM coaching_session
    WHERE created_at >= DATE_FORMAT(CURDATE() - INTERVAL 5 MONTH, '%Y-%m-01')
    GROUP BY month
    ORDER BY month
  `);

  const [monthlyReviews] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      COUNT(*) AS count
    FROM review
    WHERE created_at >= DATE_FORMAT(CURDATE() - INTERVAL 5 MONTH, '%Y-%m-01')
    GROUP BY month
    ORDER BY month
  `);

  return {
    popularQuestions,
    jobCategoryDist,
    coaching: {
      thisMonth: currentCoaching.count,
      lastMonth: lastCoaching.count,
      growth: coachingGrowth   // "+n" / "-n"
    },
    newUsers: {
      thisMonth: currentNewUsers.count,
      lastMonth: lastNewUsers.count,
      growth: newUserGrowth    // "+n" / "-n"
    },
    avgAnswerLength: avgLength.avg_length || 0,
    monthlyTrend: {
      coaching: monthlyCoaching,
      reviews: monthlyReviews
    }
  };
};

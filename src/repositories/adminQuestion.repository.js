import { pool } from "../db.config.js";

// 전체 또는 직군별 질문 목록 조회
export const findQuestions = async (jobCategoryId) => {
  let query = `
    SELECT 
      q.id,
      q.question_type,
      q.content,
      jc.name AS job_category_name
    FROM question q
    LEFT JOIN job_category jc ON q.job_category_id = jc.id
  `;

  const params = [];

  if (jobCategoryId) {
    query += ` WHERE q.job_category_id = ? `;
    params.push(jobCategoryId);
  }

  query += ` ORDER BY q.id ASC `;

  const [rows] = await pool.execute(query, params);
  return rows;
};

// 직군별 질문 통계
export const findQuestionStats = async () => {
  const query = `
    SELECT 
      jc.id AS job_category_id,
      jc.name AS job_category_name,
      COUNT(q.id) AS count
    FROM job_category jc
    LEFT JOIN question q ON q.job_category_id = jc.id
    GROUP BY jc.id, jc.name
    ORDER BY jc.id ASC
  `;

  const [rows] = await pool.execute(query);
  return rows;
};

// 전체 질문 개수
export const countAllQuestions = async () => {
  const [rows] = await pool.execute(`
    SELECT COUNT(*) AS total FROM question
  `);
  return rows[0].total;
};

// 질문 생성
export const createQuestion = async ({ content, job_category_id, question_type }) => {
  const query = `
    INSERT INTO question 
      (content, job_category_id, question_type, source_type)
    VALUES (?, ?, ?, 'template')
  `;

  const [result] = await pool.execute(query, [
    content,
    job_category_id,
    question_type
  ]);

  return result.insertId;
};

// 질문 단건 조회
export const getQuestionById = async (id) => {
  const query = `
    SELECT 
      q.id, q.content, q.job_category_id, q.question_type, q.source_type, q.created_at
    FROM question q
    WHERE q.id = ?
  `;

  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

export const editQuestion = async (id, { content, job_category_id, question_type }) => {
  const query = `UPDATE question SET content = ?, job_category_id = ?, question_type = ? WHERE id = ?`;

  const [result] = await pool.execute(query, [
    content,
    job_category_id,
    question_type,
    id
  ]);

  return result;
};

export const deleteQuestionById = async (id) => {
  const query = `DELETE FROM question WHERE id = ?`;

  const [result] = await pool.execute(query, [id]);
  return result;
};

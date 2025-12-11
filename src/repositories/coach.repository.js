import { pool } from "../db.config.js";

export const getJobCategoriesRepo = async () => {
    const [rows] = await pool.query(`
        SELECT id, name
        FROM job_category
        ORDER BY id ASC
    `);

    return rows;
};

export const getJobRolesRepo = async (jobCategoryId) => {
    try {
        const query = `
            SELECT 
                id,
                role_name
            FROM job_role
            WHERE job_category_id = ?
            ORDER BY role_name ASC
        `;

        const [rows] = await pool.query(query, [jobCategoryId]);

        return rows.map(row => ({
            id: row.id,
            name: row.role_name
        }));

    } catch (err) {
        console.error("getJobRolesRepo Error:", err.message);
        throw new Error("직군에 따른 직무 조회 실패");
    }
};

export const getCompanyListRepo = async () => {
    try {
        const query = `
            SELECT 
                id,
                company_name
            FROM company
            ORDER BY company_name ASC
        `;

        const [rows] = await pool.query(query);

        return rows.map(row => ({
            id: row.id,
            name: row.company_name
        }));
    } catch (err) {
        console.error("getCompanyListRepo Error:", err.message);
        throw new Error("기업 목록 조회 실패");
    }
};

export const getJobCategoryNameRepo = async (job_category_id) => {
    const [rows] = await pool.query(
        `SELECT name FROM job_category WHERE id = ? LIMIT 1`,
        [job_category_id]
    );

    return rows.length ? rows[0].name : null;
};

export const getJobRoleNameRepo = async (role_id) => {
    const [rows] = await pool.query(
        `SELECT role_name FROM job_role WHERE id = ? LIMIT 1`,
        [role_id]
    );

    return rows.length ? rows[0].role_name : null;
};

export const getCompanyNameRepo = async (company_id) => {
    const [rows] = await pool.query(
        `SELECT company_name FROM company WHERE id = ? LIMIT 1`,
        [company_id]
    );

    return rows.length ? rows[0].company_name : null;
};

export const findJobCategoryByIdRepo = async (jobCategoryId) => {
    try {
        const query = `
            SELECT id, name
            FROM job_category
            WHERE id = ?
        `;

        const [rows] = await pool.query(query, [jobCategoryId]);
        return rows.length > 0 ? rows[0] : null;

    } catch (err) {
        console.error("findJobCategoryByIdRepo Error:", err.message);
        throw new Error("직무 조회 실패");
    }
};

export const getQuestionsByJobCategoryRepo = async (jobCategoryId) => {
    try {
        const query = `
            SELECT 
                id,
                content,
                question_type
            FROM question
            WHERE job_category_id = ?
                AND source_type = 'template'
            ORDER BY id ASC
        `;

        const [rows] = await pool.query(query, [jobCategoryId]);

        return rows.map(row => ({
            id: row.id,
            text: row.content,
            question_type: row.question_type
        }));

    } catch (err) {
        console.error("getQuestionsByJobCategoryRepo Error:", err.message);
        throw new Error("질문 템플릿 조회 실패");
    }
};

//템플릿 질문/사용자 직접 입력 질문 구분에 사용(questionSourceResolver)
export const getQuestionById = async (questionId) => {
    if (!questionId) return null;

    const query = `
        SELECT id, content
        FROM question
        WHERE id = ?
        LIMIT 1;`;

    const [rows] = await pool.query(query, [questionId]);

    if (rows.length === 0) {
        return null;
    }

    return {
        id: rows[0].id,
        text: rows[0].content,
    };
};

export const insertCoachingSessionRepo = async (data) => {
    const query = `
        INSERT INTO coaching_session (
            user_id,
            job_category_id, job_category_name,
            role_id, role_name,
            company_id, company_name,
            question_id, question_text,
            answer_text,
            ai_feedback,
            ai_model_answer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        data.userId,
        data.job_category_id, data.job_category_name,
        data.role_id, data.role_name,
        data.company_id, data.company_name,
        data.question_id, data.question_text,
        data.answer_text,
        data.ai_feedback,
        data.ai_model_answer
    ];

    const [result] = await pool.query(query, params);
    return result.insertId;
};

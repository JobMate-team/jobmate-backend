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

//특정 role_id와 company_id 조합이 유효한지 검사
export const checkRoleCompanyMapRepo = async (role_id, company_id) => {
    const [rows] = await pool.query(
        `
        SELECT 1 
        FROM role_company_map
        WHERE role_id = ? AND company_id = ?
        LIMIT 1
        `,
        [role_id, company_id]
    );

    return rows.length > 0;  // true: 유효한 조합, false: 잘못된 조합
};

export const insertFeedbackRepo = async ({
    userId,
    job_category_id,
    job_category_name,
    role_id,
    role_name,
    company_id,
    company_name,
    question_id,
    question_text,
    answer_text,
    ai_feedback,
    ai_model_answer,
}) => {

    const sql = `
        INSERT INTO coaching_session
        (
            user_id,
            job_category_id,
            job_category_name,
            role_id,
            role_name,
            company_id,
            company_name,
            answer_text,
            ai_feedback,
            ai_model_answer,
            question_id,
            question_text,
            is_saved
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    const params = [
        userId,
        job_category_id,
        job_category_name,
        role_id,
        role_name,
        company_id,
        company_name,
        answer_text,
        ai_feedback,
        ai_model_answer,
        question_id,
        question_text
    ];

    const [result] = await pool.query(sql, params);
    return result.insertId;
};

export const checkDuplicateRepo = async ({
    userId,
    job_category_id,
    role_id,
    company_id,
    question_id,
    answer_text
}) => {
    const [rows] = await pool.query(`
        SELECT id
        FROM coaching_session
        WHERE user_id = ?
            AND job_category_id = ?
            AND role_id = ?
            AND company_id = ?
            AND question_id = ?
            AND answer_text = ?
            AND is_saved = 1
        LIMIT 1
    `, [
        userId,
        job_category_id,
        role_id,
        company_id,
        question_id,
        answer_text
    ]);

    return rows.length > 0;
};
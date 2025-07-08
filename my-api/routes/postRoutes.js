const express = require('express');
const router = express.Router();
const pool = require('../db');

// get posts
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT
          n.newsid AS newsId,
          n.title AS title,
          n.ordernum AS orderNum,
          n.contractor AS contractor,
          n.contractcost AS contractCost,
          n.supervisor AS engener,
          n.startdate AS startDate,
          n.enddate AS endDate,
          n.impphase AS impPhase,
          n.imppercent AS impPercent,
          n.sources AS source,
          n.totalcost AS totalCost,
          n.branch AS branch,
          n.createdat AS createdAt,
          n.updatedat AS updatedAt,
          JSON_AGG(JSON_BUILD_OBJECT('id', k.khid, 'name', k.khname)) AS khoroos
        FROM news n
        LEFT JOIN news_khids nk ON nk.news_id = n.newsid
        LEFT JOIN khoroo k ON k.khid = nk.khoroo_id
        GROUP BY n.newsid
        ORDER BY n.newsid DESC
      `);

        res.json({
            data: result.rows,
            total: result.rowCount
        });
    } catch (err) {
        console.error('Fetch news error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
//posts detail
router.post('/detail', async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query(`
        SELECT
          n.newsid AS newsId,
          n.title AS title,
          n.ordernum AS orderNum,
          n.contractor AS contractor,
          n.contractcost AS contractCost,
          n.supervisor AS engener,
          n.startdate AS startDate,
          n.enddate AS endDate,
          n.impphase AS impPhase,
          n.imppercent AS impPercent,
          n.sources AS source,
          n.totalcost AS totalCost,
          n.news AS news,
          n.branch AS branch,
          n.createdat AS createdAt,
          n.updatedat AS updatedAt,
          JSON_AGG(JSON_BUILD_OBJECT('id', k.khid, 'name', k.khname)) AS khoroos
        FROM news n
        LEFT JOIN news_khids nk ON nk.news_id = n.newsid
        LEFT JOIN khoroo k ON k.khid = nk.khoroo_id
        WHERE n.newsid = $1
        GROUP BY n.newsid
        ORDER BY n.newsid DESC
      `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Мэдээлэл олдсонгүй' });
        }

        res.json({
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Fetch news error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// news create 
router.post('/create', async (req, res) => {
    const {
        title,
        orderNum,
        contractor,
        contractCost,
        supervisor,
        supervisor_id,
        startDate,
        endDate,
        impPhase,
        impPhase_id,
        impPercent,
        source,
        source_id,
        branch,
        branch_id,
        totalCost,
        news,
        khoroo, // энэ нь [1, 2, 3] гэх мэт array гэж үзнэ
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const insertNewsResult = await client.query(
            `INSERT INTO news
          (title, ordernum, contractor, contractcost, supervisor, supervisor_id, startdate, enddate, impphase, impphase_id, imppercent, sources, source_id, branch, branch_id, totalcost, news)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15,$16,$17)
         RETURNING newsid`,
            [
                title,
                orderNum,
                contractor,
                contractCost,
                supervisor,
                supervisor_id,
                startDate,
                endDate,
                impPhase,
                impPhase_id,
                impPercent,
                source,
                source_id,
                branch,
                branch_id,
                totalCost,
                news,
            ]
        );

        const newsId = insertNewsResult.rows[0].newsid;

        if (Array.isArray(khoroo)) {
            const insertKhorooValues = khoroo.map((khid) => `(${newsId}, ${khid})`).join(',');
            await client.query(`INSERT INTO news_khids (news_id, khoroo_id) VALUES ${insertKhorooValues}`);
        }

        await client.query('COMMIT');

        res.json({ message: 'Амжилттай хадгалагдлаа', newsId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Insert error:', err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});
// routes/posts.js
router.put('/edit', async (req, res) => {
    const {
        newsId,
        title,
        orderNum,
        contractor,
        contractCost,
        supervisor,
        supervisor_id,
        startDate,
        endDate,
        impPhase,
        impPhase_id,
        impPercent,
        source,
        source_id,
        branch,
        branch_id,
        totalCost,
        news,
        khoroo // массив: [14, 13]
    } = req.body;

    if (!Array.isArray(khoroo)) {
        return res.status(400).json({ error: 'khoroo массив байх ёстой' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
      UPDATE news
      SET
        title = $1,
        ordernum = $2,
        contractor = $3,
        contractcost = $4,
        supervisor = $5,
        supervisor_id = $6,
        startdate = $7,
        enddate = $8,
        impphase = $9,
        impphase_id = $10,
        imppercent = $11,
        sources = $12,
        source_id = $13,
        branch = $14,
        branch_id = $15,
        totalcost = $16,
        news = $17,
        updatedat = NOW()
      WHERE newsid = $18
    `, [
            title,
            orderNum,
            contractor,
            contractCost,
            supervisor,
            supervisor_id,
            new Date(startDate),
            new Date(endDate),
            impPhase,
            impPhase_id,
            impPercent,
            source,
            source_id,
            branch,
            branch_id,
            totalCost,
            news,
            newsId
        ]);

        // Хуучин холбоосыг устгах
        await client.query(`DELETE FROM news_khids WHERE news_id = $1`, [newsId]);

        // Шинэ khoroo холбоос нэмэх
        for (const khId of khoroo) {
            await client.query(
                `INSERT INTO news_khids (news_id, khoroo_id) VALUES ($1, $2)`,
                [newsId, khId]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, message: 'Мэдээлэл амжилттай шинэчлэгдлээ' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Edit post error:', error);
        res.status(500).json({ error: 'Сервер дээр алдаа гарлаа' });

    } finally {
        client.release();
    }
});


// DELETE: Мэдээлэл устгах
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // newsId-ээр устгах
        const result = await pool.query('DELETE FROM news WHERE newsid = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Мэдээлэл олдсонгүй' });
        }

        res.status(200).json({ message: 'Амжилттай устгалаа', deleted: result.rows[0] });
    } catch (err) {
        console.error('Устгах үед алдаа:', err.message);
        res.status(500).json({ error: 'Серверийн алдаа' });
    }
});


// хайлт хийх 
router.post('/search', async (req, res) => {
    const { title } = req.body;

    let query = `
      SELECT
        n.newsid AS newsId,
        n.title AS title,
        n.ordernum AS orderNum,
        n.contractor AS contractor,
        n.contractcost AS contractCost,
        n.supervisor AS engener,
        n.startdate AS startDate,
        n.enddate AS endDate,
        n.impphase AS impPhase,
        n.imppercent AS impPercent,
        n.sources AS source,
        n.totalcost AS totalCost,
        n.branch AS branch,
        n.createdat AS createdAt,
        n.updatedat AS updatedAt,
        ARRAY_AGG(k.khname) AS khoroo
      FROM news n
      LEFT JOIN news_khids nk ON nk.news_id = n.newsid
      LEFT JOIN khoroo k ON k.khid = nk.khoroo_id
    `;

    const conditions = [];
    const values = [];

    if (title) {
        values.push(`%${title}%`);
        conditions.push(`n.title ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY n.newsid
      ORDER BY n.newsid DESC
    `;

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Мэдээлэл олдсонгүй' });
        }

        res.json({
            data: result.rows,
            total: result.rowCount,
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/posts/count
router.get('/count', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM news');
        const count = parseInt(result.rows[0].count, 10);
        res.json({ totalPosts: count });
    } catch (err) {
        console.error('Posts count error:', err.message);
        res.status(500).json({ error: 'Мэдээний тоог авахад алдаа гарлаа' });
    }
});


module.exports = router;
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
          n.engeneer AS engener,
          n.startdate AS startDate,
          n.enddate AS endDate,
          n.impphase AS impPhase,
          n.imppercent AS impPercent,
          n.sources AS source,
          n.totalcost AS totalCost,
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
            n.engeneer AS engener,
            n.startdate AS startDate,
            n.enddate AS endDate,
            n.impphase AS impPhase,
            n.imppercent AS impPercent,
            n.sources AS source,
            n.totalcost AS totalCost,
            n.news AS news,
            n.createdat AS createdAt,
            n.updatedat AS updatedAt,
             JSON_AGG(JSON_BUILD_OBJECT('id', k.khid, 'name', k.khname)) AS khoroos
        FROM news n
        LEFT JOIN news_khids nk ON nk.news_id = n.newsid
        LEFT JOIN khoroo k ON k.khid = nk.khoroo_id
        GROUP BY n.newsid
        ORDER BY n.newsid DESC
            WHERE n.newsid = $1
            `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Мэдээлэл олдсонгүй' });
        }

        res.json({
            data: result.rows[0]  // ганцхан мэдээ буцаана
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
        engener,
        startDate,
        endDate,
        impPhase,
        impPercent,
        source,
        totalCost,
        news,
        khoroo, // энэ нь [1, 2, 3] гэх мэт array гэж үзнэ
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const insertNewsResult = await client.query(
            `INSERT INTO news
          (title, ordernum, contractor, contractcost, engeneer, startdate, enddate, impphase, imppercent, sources, totalcost, news)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING newsid`,
            [
                title,
                orderNum,
                contractor,
                contractCost,
                engener,
                startDate,
                endDate,
                impPhase,
                impPercent,
                source,
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
        n.engeneer AS engener,
        n.startdate AS startDate,
        n.enddate AS endDate,
        n.impphase AS impPhase,
        n.imppercent AS impPercent,
        n.sources AS source,
        n.totalcost AS totalCost,
        n.news AS news,
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




module.exports = router;
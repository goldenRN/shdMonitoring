const express = require('express');
const router = express.Router();
const pool = require('../db');

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
        ARRAY_AGG(k.khname) AS khoroo
        FROM news n
        LEFT JOIN khoroo k ON k.khid = ANY(n.khid) -- ← энэ бол array JOIN
        GROUP BY n.newsid
        ORDER BY n.newsid DESC`)

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
            k.khname AS khoroo
        FROM news n 
         JOIN khoroo k ON k.khid = n.khid
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
        khoroo,
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO news
            (title, ordernum, contractor, contractcost, engeneer, startdate, enddate, impphase, imppercent, sources, totalcost, news, khid) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING * `,
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
                khoroo,
            ]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// garchignaas хайлт хийх 
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
            k.khname AS khoroo
        FROM news n
        JOIN khoroo k ON k.khid = n.khid
            `;

    const conditions = [];
    const values = [];


    if (title) {
        values.push(`% ${title} % `);
        conditions.push(`n.title ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY n.newsid DESC';

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Мэдээлэл олдсонгүй' });
        } else {
            res.json({
                data: result.rows,
                total: result.rowCount
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
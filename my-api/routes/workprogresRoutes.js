
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET салбарын мэдээлэл авах

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT
          wp_id AS wp_id,
          wp_name AS wp_name
        FROM workprogress
      `);

        res.json(result.rows);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//CREATE салбар үүсгэх
router.post('/create', async (req, res) => {

    const { wp_name } = req.body;

    try {
        // 1. Давхардал шалгах 
        const existing = await pool.query(
            'SELECT * FROM workprogress WHERE LOWER(wp_name) = LOWER($1)',
            [wp_name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэрээр Ажлын явц бүртгэгдсэн байна' });
        }
        // 2. Шинээр үүсгэх
        const result = await pool.query('INSERT INTO workprogress (wp_name) VALUES ($1)', [wp_name]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT edit salbar
router.put('/edit', async (req, res) => {
    const { wp_id, wp_name } = req.body;

    try {
        // 1. Давхардал шалгах (өөр `id`-тэй мөр дунд ийм нэр байгаа эсэх)
        const existing = await pool.query(
            'SELECT * FROM workprogress WHERE LOWER(wp_name) = LOWER($1) AND wp_id != $2',
            [wp_name, wp_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэрээр Ажлын явц бүртгэгдсэн байна' });
        }

        // 2. Шинэчлэх
        const result = await pool.query(
            'UPDATE workprogress SET wp_name = $1 WHERE wp_id = $2 RETURNING *',
            [wp_name, wp_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ажлын явц олдсонгүй' });
        }

        await pool.query(
            'UPDATE news SET impphase = $1 WHERE impphase_id = $2 RETURNING *',
            [wp_name, wp_id]
        );
        //  res.json({ success: true, updatedBranch: result.rows[0] });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update error:', err.message);
        res.status(500).send('Серверийн алдаа');
    }
});

// delete salbar
router.delete('/:id', async (req, res) => {
    const wpId = req.params.id;

    try {
        // Эхлээд тухайн хороо news_khids дээр ашиглагдсан эсэхийг шалгах
        const checkResult = await pool.query(
            'SELECT COUNT(*) FROM news WHERE impphase_id = $1',
            [wpId]
        );

        const count = parseInt(checkResult.rows[0].count, 10);

        if (count > 0) {
            return res.status(400).json({
                error: `Ажлын явцтай холбогдсон ${count} мэдээлэл байна. Эхлээд тэдгээрийг устгана уу.`,
            });
        }

        // Ашиглагдаагүй бол устгана
        const deleteResult = await pool.query(
            'DELETE FROM workprogress WHERE wp_id = $1',
            [wpId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Ажлын явц олдсонгүй' });
        }

        res.json({ success: true, message: 'Ажлын явц амжилттай устлаа' });
    } catch (err) {
        console.error('Ажлын явц устгах алдаа:', err);
        res.status(500).json({ error: 'Серверийн алдаа' });
    }
});
// GET /count
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM workprogress');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ totalwp: count });
  } catch (err) {
    console.error(' count error:', err.message);
    res.status(500).json({ error: 'Ажлын явцын тоог авахад алдаа гарлаа' });
  }
});

module.exports = router;
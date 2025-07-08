
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET салбарын мэдээлэл авах				

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`				
SELECT				
sc_id AS sc_id,				
sc_name AS sc_name,				
sc_status AS sc_status				
FROM source				
`);

        res.json(result.rows);
    } catch (err) {
        console.error('Fetch salbar error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//CREATE source үүсгэх				
router.post('/create', async (req, res) => {

    const { sc_name, sc_status } = req.body;

    try {
        // 1. Давхардал шалгах				
        const existing = await pool.query(
            'SELECT * FROM source WHERE LOWER(sc_name) = LOWER($1)',
            [sc_name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэртэй эх үүсвэр аль хэдийн бүртгэгдсэн байна' });
        }
        // 2. Шинээр үүсгэх				
        const result = await pool.query('INSERT INTO source (sc_name, sc_status) VALUES ($1,$2)', [sc_name, sc_status]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT edit source				
router.put('/edit', async (req, res) => {
    const { sc_id, sc_name, sc_status } = req.body;

    try {
        // 1. Давхардал шалгах				
        const existing = await pool.query(
            'SELECT * FROM source WHERE LOWER(sc_name) = LOWER($1) AND sc_id != $2',
            [sc_name, sc_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэртэй эх үүсвэр аль хэдийн бүртгэгдсэн байна' });
        }

        // 2. Шинэчлэх				
        const result = await pool.query(
            'UPDATE source SET sc_name = $1, sc_status = $2 WHERE sc_id = $3 RETURNING *',
            [sc_name, parseInt(sc_status), parseInt(sc_id)]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'эх үүсвэр олдсонгүй' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update error:', err.message);
        res.status(500).send({ error: 'Серверийн алдаа' });
    }
});


// delete salbar				
router.delete('/:id', async (req, res) => {
    const sourceId = req.params.id;

    try {
        // Эхлээд тухайн хороо news_khids дээр ашиглагдсан эсэхийг шалгах				
        const checkResult = await pool.query(
            'SELECT COUNT(*) FROM news WHERE source_id = $1',
            [sourceId]
        );

        const count = parseInt(checkResult.rows[0].count, 10);

        if (count > 0) {
            return res.status(400).json({
                error: `Энэ эх үүсвэртэй холбогдсон ${count} мэдээлэл байна. Эхлээд тэдгээрийг устгана уу.`,
            });
        }

        // Ашиглагдаагүй бол устгана				
        const deleteResult = await pool.query(
            'DELETE FROM source WHERE sc_id = $1',
            [sourceId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'эх үүсвэр олдсонгүй' });
        }

        res.json({ success: true, message: 'эх үүсвэр амжилттай устлаа' });
    } catch (err) {
        console.error('салбар устгах алдаа:', err);
        res.status(500).json({ error: 'Серверийн алдаа' });
    }
});
// GET /count
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM source');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ totalsource: count });
  } catch (err) {
    console.error(' count error:', err.message);
    res.status(500).json({ error: ' тоог авахад алдаа гарлаа' });
  }
});

module.exports = router;				
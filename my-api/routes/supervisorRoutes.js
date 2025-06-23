
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET салбарын мэдээлэл авах

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT
          s_id AS s_id,
          s_name AS s_name
        FROM supervisor
      `);

        res.json(result.rows);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//CREATE салбар үүсгэх
router.post('/create', async (req, res) => {

    const { s_name } = req.body;

    try {
        // 1. Давхардал шалгах 
        const existing = await pool.query(
            'SELECT * FROM supervisor WHERE LOWER(s_name) = LOWER($1)',
            [s_name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэрээр Захиалагчын хяналтын байгууллага бүртгэгдсэн байна' });
        }
        // 2. Шинээр үүсгэх
        const result = await pool.query('INSERT INTO supervisor (s_name) VALUES ($1)', [s_name]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT edit salbar
router.put('/edit', async (req, res) => {
    const { s_id, s_name } = req.body;

    try {
        // 1. Давхардал шалгах (өөр `id`-тэй мөр дунд ийм нэр байгаа эсэх)
        const existing = await pool.query(
            'SELECT * FROM supervisor WHERE LOWER(s_name) = LOWER($1) AND s_id != $2',
            [s_name, s_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэрээр аль хэдийн бүртгэгдсэн байна' });
        }

        // 2. Шинэчлэх
        const result = await pool.query(
            'UPDATE supervisor SET s_name = $1 WHERE s_id = $2 RETURNING *',
            [s_name, s_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Захиалагчын хяналтын байгууллага олдсонгүй' });
        }

        await pool.query(
            'UPDATE news SET supervisor = $1 WHERE supervisor_id = $2 RETURNING *',
            [s_name, s_id]
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
    const sId = req.params.id;

    try {
        // Эхлээд тухайн хороо news_khids дээр ашиглагдсан эсэхийг шалгах
        const checkResult = await pool.query(
            'SELECT COUNT(*) FROM news WHERE supervisor_id = $1',
            [sId]
        );

        const count = parseInt(checkResult.rows[0].count, 10);

        if (count > 0) {
            return res.status(400).json({
                error: `Захиалагчын хяналтын байгууллагатай холбогдсон ${count} мэдээлэл байна. Эхлээд тэдгээрийг устгана уу.`,
            });
        }

        // Ашиглагдаагүй бол устгана
        const deleteResult = await pool.query(
            'DELETE FROM supervisor WHERE s_id = $1',
            [sId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Захиалагчын хяналтын байгууллага олдсонгүй' });
        }

        res.json({ success: true, message: 'Захиалагчын хяналтын байгууллага амжилттай устлаа' });
    } catch (err) {
        console.error('Захиалагчын хяналтын байгууллага устгах алдаа:', err);
        res.status(500).json({ error: 'Серверийн алдаа' });
    }
});
module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET салбарын мэдээлэл авах

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT
          b_id AS b_id,
          b_name AS b_name
        FROM branch
      `);

        res.json(result.rows);
    } catch (err) {
        console.error('Fetch salbar error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//CREATE салбар үүсгэх
router.post('/create', async (req, res) => {

    const { b_name } = req.body;

    try {
        // 1. Давхардал шалгах 
        const existing = await pool.query(
            'SELECT * FROM branch WHERE LOWER(b_name) = LOWER($1)',
            [b_name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэртэй салбар аль хэдийн бүртгэгдсэн байна' });
        }
        // 2. Шинээр үүсгэх
        const result = await pool.query('INSERT INTO branch (b_name) VALUES ($1)', [branch]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT edit salbar
router.put('/edit', async (req, res) => {
    const { b_id, b_name } = req.body;

    try {
        // 1. Давхардал шалгах (өөр `id`-тэй мөр дунд ийм нэр байгаа эсэх)
        const existing = await pool.query(
            'SELECT * FROM branch WHERE LOWER(b_name) = LOWER($1) AND b_id != $2',
            [b_name, b_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Ийм нэртэй салбар аль хэдийн бүртгэгдсэн байна' });
        }

        // 2. Шинэчлэх
        const result = await pool.query(
            'UPDATE branch SET b_name = $1 WHERE b_id = $2 RETURNING *',
            [b_name, b_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Салбар олдсонгүй' });
        }

        await pool.query(
            'UPDATE news SET branch = $1 WHERE branch_id = $2 RETURNING *',
            [b_name, b_id]
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
    const salbarId = req.params.id;

    try {
        // Эхлээд тухайн хороо news_khids дээр ашиглагдсан эсэхийг шалгах
        const checkResult = await pool.query(
            'SELECT COUNT(*) FROM news WHERE branch_id = $1',
            [salbarId]
        );

        const count = parseInt(checkResult.rows[0].count, 10);

        if (count > 0) {
            return res.status(400).json({
                error: `Энэ салбартай холбогдсон ${count} мэдээлэл байна. Эхлээд тэдгээрийг устгана уу.`,
            });
        }

        // Ашиглагдаагүй бол устгана
        const deleteResult = await pool.query(
            'DELETE FROM branch WHERE b_id = $1',
            [salbarId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Салбар олдсонгүй' });
        }

        res.json({ success: true, message: 'Салбар амжилттай устлаа' });
    } catch (err) {
        console.error('салбар устгах алдаа:', err);
        res.status(500).json({ error: 'Серверийн алдаа' });
    }
});
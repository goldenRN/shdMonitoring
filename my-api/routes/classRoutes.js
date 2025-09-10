const express = require('express');
const router = express.Router();
const pool = require('../db');


// GET бүлгийн мэдээлэл авах

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM classes 
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Амжилтгүй :', err);
    res.status(500).json({ error: 'Server error' });
  }
});


//CREATE бүлэг үүсгэх
router.post('/create', async (req, res) => {

  const { class_name, description } = req.body;

  try {
    // 1. Давхардал шалгах 
    const existing = await pool.query(
      'SELECT * FROM classes WHERE LOWER(class_name) = LOWER($1)',
      [class_name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ийм нэрээр бүртгэгдсэн байна' });
    }
    // 2. Шинээр үүсгэх
    const result = await pool.query('INSERT INTO classes (class_name, description) VALUES ($1, $2)', [class_name, description]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT edit khoroo
router.put('/edit', async (req, res) => {
  const { class_id, class_name, description } = req.body;

  try {
    // 1. Давхардал шалгах (өөр `id`-тэй мөр дунд ийм нэр байгаа эсэх)
    const existing = await pool.query(
      'SELECT * FROM classes WHERE LOWER(class_name) = LOWER($1) AND class_id != $2',
      [class_name, class_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ийм нэртэй Бүлэг аль хэдийн бүртгэгдсэн байна' });
    }

    // 2. Шинэчлэх
    const result = await pool.query(
      'UPDATE classes SET class_name = $1, description = $2 WHERE class_id = $3 RETURNING *',
      [class_name, description, class_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Бүлэг олдсонгүй' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).send('Серверийн алдаа');
  }
});


// delete burtgel
router.delete('/:id', async (req, res) => {
  const class_id = req.params.id;

  try {
    // Эхлээд тухайн бүлгийг ашиглагдсан эсэхийг шалгах
    const checkResult = await pool.query(
      'SELECT COUNT(*) FROM news WHERE class_id = $1',
      [class_id]
    );

    const count = parseInt(checkResult.rows[0].count, 10);

    if (count > 0) {
      return res.status(400).json({
        error: `Энэ бүлэгт ${count} мэдээлэл байна. Эхлээд тэдгээрийг устгана уу.`,
      });
    }

    // Ашиглагдаагүй бол устгана
    const deleteResult = await pool.query(
      'DELETE FROM classes WHERE class_id = $1',
      [class_id]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Бүлэг олдсонгүй' });
    }

    res.json({ success: true, message: 'Бүлэг амжилттай устлаа' });
  } catch (err) {
    console.error('Бүлэг устгахад алдаа гарлаа :', err);
    res.status(500).json({ error: 'Серверийн алдаа' });
  }
});

// GET /api/khoroo/count
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM classes');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ totalClasses: count });
  } catch (err) {
    console.error('Classes count error:', err.message);
    res.status(500).json({ error: 'Бүлгийн тоог авахад алдаа гарлаа' });
  }
});


module.exports = router;
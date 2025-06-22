const express = require('express');
const router = express.Router();
const pool = require('../db');


// GET хорооны мэдээлэл авах

router.get('/district', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        distid
        distname 
      FROM district 
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch district error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET хорооны мэдээлэл авах

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
          k.khid AS id,
          k.khname AS name,
          d.distname AS district
        FROM khoroo k
        JOIN district d ON k.distid = d.distid
        ORDER BY k.khid DESC
      `);

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch khoroo error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//CREATE хороо үүсгэх
router.post('/create', async (req, res) => {

  const { khoroo } = req.body;

  try {
    const result = await pool.query('INSERT INTO khoroo (khname, distid) VALUES ($1, $2)', [khoroo, 1]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT edit khoroo
router.put('/edit', async (req, res) => {
  const { id, khoroo, district } = req.body;

  try {
    // 1. Давхардал шалгах (өөр `id`-тэй мөр дунд ийм нэр байгаа эсэх)
    const existing = await pool.query(
      'SELECT * FROM khoroo WHERE LOWER(khname) = LOWER($1) AND khid != $2',
      [khoroo, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ийм нэртэй хороо аль хэдийн бүртгэгдсэн байна' });
    }

    // 2. Шинэчлэх
    const result = await pool.query(
      'UPDATE khoroo SET khname = $1, distid = $2 WHERE khid = $3 RETURNING *',
      [khoroo, district, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Хороо олдсонгүй' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).send('Серверийн алдаа');
  }
});

// // PUT edit khoroo
// router.put('/edit', async (req, res) => {
//     const { id, khoroo, district } = req.body;

//     try {
//       const result = await pool.query(
//         'UPDATE khoroo SET khname = $1, distid = $2 WHERE khid = $3 RETURNING *',
//         [khoroo, district, id]
//       );

//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Хороо олдсонгүй' });
//       }

//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Update error:', err.message);
//       res.status(500).send('Server error');
//     }
//   });

// Дүүргийн жагсаалт авах
router.get('/districts', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT distid AS id, distname AS name FROM district ORDER BY distid`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// хороогоор хайлт хийх 
router.post('/search', async (req, res) => {
  const { id } = req.body;

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

  if (id) {
    values.push(id);
    conditions.push(`k.khid = $${values.length}`);
  }

  // if (name) {
  //     values.push(`%${name}%`);
  //     conditions.push(`k.khname ILIKE $${values.length}`);
  // }

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
// router.delete('/khoroo/delete/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query('DELETE FROM khoroo WHERE khid = $1', [id]);

//     if (result.rowCount === 0) {
//       return res.status(404).send('Хороо олдсонгүй');
//     }

//     res.status(204).send(); // Амжилттай, ямар ч body байхгүй
//   } catch (err) {
//     console.error('Хороо устгах алдаа:', err);
//     res.status(500).send('Серверийн алдаа');
//   }
// });

// delete khoroo
router.delete('/khoroo/:id', async (req, res) => {
  const khorooId = req.params.id;

  try {
    // Эхлээд тухайн хороо news_khids дээр ашиглагдсан эсэхийг шалгах
    const checkResult = await pool.query(
      'SELECT COUNT(*) FROM news_khids WHERE khoroo_id = $1',
      [khorooId]
    );

    const count = parseInt(checkResult.rows[0].count, 10);

    if (count > 0) {
      return res.status(400).json({
        error: `Энэ хороотой холбогдсон ${count} мэдээлэл байна. Эхлээд тэдгээрийг устгана уу.`,
      });
    }

    // Ашиглагдаагүй бол устгана
    const deleteResult = await pool.query(
      'DELETE FROM khoroo WHERE khid = $1',
      [khorooId]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Хороо олдсонгүй' });
    }

    res.json({ success: true, message: 'Хороо амжилттай устлаа' });
  } catch (err) {
    console.error('Khoroo устгах алдаа:', err);
    res.status(500).json({ error: 'Серверийн алдаа' });
  }
});


module.exports = router;
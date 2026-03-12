const express = require('express');
const router = express.Router();
const pool = require('../db');
const fs = require('fs');
const path = require('path');
const QRCode = require("qrcode");

// get posts
router.post('/', async (req, res) => {
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
          n.branch AS branch,
          n.createdat AS createdAt,
          n.class_id AS class_id,
          n.updatedat AS updatedAt,
          JSON_AGG(JSON_BUILD_OBJECT('id', k.khid, 'name', k.khname)) AS khoroos
        FROM news n
        LEFT JOIN news_khids nk ON nk.news_id = n.newsid
        LEFT JOIN khoroo k ON k.khid = nk.khoroo_id
        WHERE n.class_id=$1 
        GROUP BY n.newsid 
        ORDER BY n.newsid DESC
      `, [id]);

    res.json({
      data: result.rows,
      total: result.rowCount
    });
  } catch (err) {
    console.error('Fetch news error:', err);
    res.status(500).json({ error: 'Server error', err });
  }
});
// post posts
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
          n.class_id AS class_id,
          n.qr_code AS qr_code,
          n.updatedat AS updatedAt,
          JSON_AGG(JSON_BUILD_OBJECT('id', k.khid, 'name', k.khname)) AS khoroos
        FROM news n
        LEFT JOIN news_khids nk ON nk.news_id = n.newsid
        LEFT JOIN khoroo k ON k.khid = nk.khoroo_id WHERE n.is_archived = false
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
          n.class_id AS class_id,
          n.qr_code AS qr_code,
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
    class_id,
    khoroo, // энэ нь [1, 2, 3] гэх мэт array гэж үзнэ
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertNewsResult = await client.query(
      `INSERT INTO news
          (title, ordernum, contractor, contractcost, supervisor, supervisor_id, startdate, enddate, impphase, impphase_id, imppercent, sources, source_id, branch, branch_id, totalcost, news, class_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15,$16,$17, $18)
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
        class_id
      ]
    );

    const newsId = insertNewsResult.rows[0].newsid;
    // QR URL (public page)
    const qrUrl = `https://shdmonitoring.ub.gov.mn/detail/${newsId}`;
    // QR generate (base64 image)
    const qrImage = await QRCode.toDataURL(qrUrl);

    //  DB-д хадгалах
    await client.query(
      `UPDATE news SET qr_code = $1 WHERE newsid = $2`,
      [qrImage, newsId]
    );
    // khoroo insert
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
// edit

// 🧠 Utility функц: нэрээр ID-г авах
async function findIdByName(client, table, idField, nameField, name) {
  if (!name) return null;
  const query = `
    SELECT ${idField} FROM ${table}
    WHERE TRIM(LOWER(${nameField})) = TRIM(LOWER($1))
    LIMIT 1
  `;
  const result = await client.query(query, [name]);
  return result.rows[0]?.[idField] || null;
}

// 🛡 Огноог ISO болгох
const safeDateToISOString = (val) => {
  if (!val) return null;
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

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
    class_id,
    khoroo // массив: [14, 13] эсвэл string
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ✅ ID-г нэрээр нь олж авах
    const finalSourceId = source_id || await findIdByName(client, 'source', 'sc_id', 'sc_name', source);
    const finalSupervisorId = supervisor_id || await findIdByName(client, 'supervisor', 's_id', 's_name', supervisor);
    const finalBranchId = branch_id || await findIdByName(client, 'branch', 'b_id', 'b_name', branch);
    const finalImpPhaseId = impPhase_id || await findIdByName(client, 'workprogress', 'wp_id', 'wp_name', impPhase);

    // ✅ news хүснэгт шинэчлэх
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
        class_id = $18,
        updatedat = NOW()
      WHERE newsid = $19
    `, [
      title,
      orderNum,
      contractor,
      contractCost,
      supervisor,
      finalSupervisorId,
      safeDateToISOString(startDate),
      safeDateToISOString(endDate),
      impPhase,
      finalImpPhaseId,
      impPercent,
      source,
      finalSourceId,
      branch,
      finalBranchId,
      totalCost,
      news,
      class_id,
      newsId
    ]);

    // ✅ Хорооны холбоосыг шинэчлэх
    await client.query(`DELETE FROM news_khids WHERE news_id = $1`, [newsId]);

    let khorooArray = [];

    if (Array.isArray(khoroo)) {
      khorooArray = khoroo;
    } else if (typeof khoroo === 'string') {
      try {
        const parsed = JSON.parse(khoroo);
        if (Array.isArray(parsed)) {
          khorooArray = parsed;
        }
      } catch (err) {
        console.warn('⚠ khoroo parse error:', err);
      }
    }

    for (const khId of khorooArray) {
      if (khId !== null && khId !== undefined) {
        await client.query(
          `INSERT INTO news_khids (news_id, khoroo_id) VALUES ($1, $2)`,
          [newsId, khId]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Мэдээлэл амжилттай шинэчлэгдлээ' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Edit post error:', error);
    res.status(500).json({
      error: 'Сервер дээр алдаа гарлаа',
      message: error.message,
      details: error.stack
    });
  } finally {
    client.release();
  }
});


// DELETE: Мэдээлэл болон холбогдсон зургуудыг устгах
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. newsid-тай холбоотой зургуудыг авна
    const imageResult = await pool.query(
      'SELECT imagepath FROM image WHERE newsid = $1',
      [id]
    );

    // 2. Тухайн зургуудыг файл системээс устгах
    for (const row of imageResult.rows) {
      const imagePath = path.join('/home/ndc-user', row.imagepath); // image/image.jpg
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Файл устгах үед алдаа (${row.imagepath}):`, err.message);
        } else {
          console.log(`Файл устгав: ${imagePath}`);
        }
      });
    }

    // 3. DB-ээс зургуудыг устгах
    await pool.query('DELETE FROM image WHERE newsid = $1', [id]);

    // 4. Мэдээг өөрийг нь устгах
    const result = await pool.query(
      'DELETE FROM news WHERE newsid = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Мэдээлэл олдсонгүй' });
    }

    res.status(200).json({ message: 'Мэдээлэл болон зургууд амжилттай устлаа', deleted: result.rows[0] });
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
      n.newsid AS "newsId",
      n.title AS "title",
      n.ordernum AS "orderNum",
      n.contractor AS "contractor",
      n.contractcost AS "contractCost",
      n.supervisor AS "engener",
      n.startdate AS "startDate",
      n.enddate AS "endDate",
      n.impphase AS "impPhase",
      n.imppercent AS "impPercent",
      n.sources AS "source",
      n.totalcost AS "totalCost",
      n.branch AS "branch",
      n.class_id AS "class_id",
      n.createdat AS "createdAt",
      n.updatedat AS "updatedAt",
      ARRAY_AGG(k.khname) AS "khoroo"
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
    res.json({ data: result.rows, total: result.rowCount });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/posts/count/all
router.get('/count/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM news');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ totalPosts: count });
  } catch (err) {
    console.error('Posts count error (all):', err.message);
    res.status(500).json({ error: 'Нийт мэдээний тоог авахад алдаа гарлаа' });
  }
});

// GET /api/posts/count/active
router.get('/count/active', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM news WHERE is_archived = false');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ totalPosts: count });
  } catch (err) {
    console.error('Posts count error (active):', err.message);
    res.status(500).json({ error: 'Идэвхтэй мэдээний тоог авахад алдаа гарлаа' });
  }
});

// GET /api/posts/count/archive
router.get('/count/archive', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM news WHERE is_archived = true');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ totalPosts: count });
  } catch (err) {
    console.error('Posts count error (archive):', err.message);
    res.status(500).json({ error: 'Архив мэдээний тоог авахад алдаа гарлаа' });
  }
});

router.get('/source-news-count', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.sc_status,
        COUNT(n.*) AS news_count
      FROM source s
      JOIN news n ON n.source_id = s.sc_id
      GROUP BY s.sc_status
      ORDER BY s.sc_status
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Stat query error:', err);
    res.status(500).json({ error: 'Серверийн алдаа' });
  }
});

router.get('/source-average-precent', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.sc_status,
        ROUND(AVG(p.imppercent), 2) AS average_precent,
        COUNT(p.newsid) AS news
      FROM 
        source s
      JOIN 
        news p ON p.source = s.sc_name
      GROUP BY 
        s.sc_status
      ORDER BY 
        s.sc_status
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Алдаа:', err.message);
    res.status(500).json({ error: 'Серверийн алдаа' });
  }
});
//archive postnuud avah
router.get('/archive', async (req, res) => {
  const result = await pool.query(`
    SELECT 
      n.*,
      COALESCE(
        JSONB_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'id', k.khid,
            'name', k.khname
          )
        ) FILTER (WHERE k.khid IS NOT NULL),
        '[]'::jsonb
      ) AS khoroos
    FROM news n
    LEFT JOIN news_khids nk ON nk.news_id = n.newsid
    LEFT JOIN khoroo k ON k.khid = nk.khoroo_id
    WHERE n.is_archived = true
    GROUP BY n.newsid
    ORDER BY n.updatedat DESC
  `);

  res.json(result.rows);
});

module.exports = router;

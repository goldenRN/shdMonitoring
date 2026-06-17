const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const pool = require('../db');

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.jfif',
]);

let schemaPromise = null;

function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await pool.query(`
        ALTER TABLE classes
        ADD COLUMN IF NOT EXISTS image_path TEXT,
        ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS class_subcategories (
          subcategory_id SERIAL PRIMARY KEY,
          class_id INTEGER NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  return schemaPromise;
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, '/home/ndc-user/image');
    },
    filename: function (_req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ALLOWED_IMAGE_EXTENSIONS.has(ext) ? ext : '.jpg';
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeOk = ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype);
    const extOk = ALLOWED_IMAGE_EXTENSIONS.has(ext);

    if (!mimeOk || !extOk) {
      return cb(new Error('Зөвхөн зураг файл (jpg/jpeg/png/webp/gif) зөвшөөрнө.'));
    }

    return cb(null, true);
  },
});

function normalizeSubcategories(rawSubcategories) {
  if (!Array.isArray(rawSubcategories)) return [];

  return rawSubcategories
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          name: item.trim(),
          sort_order: index,
        };
      }

      if (item && typeof item === 'object') {
        return {
          name: String(item.name ?? '').trim(),
          sort_order: Number.isFinite(Number(item.sort_order))
            ? Number(item.sort_order)
            : index,
        };
      }

      return null;
    })
    .filter((item) => item && item.name);
}

async function insertSubcategories(client, classId, subcategories) {
  const normalized = normalizeSubcategories(subcategories);

  if (normalized.length === 0) {
    return;
  }

  const values = [];
  const placeholders = normalized.map((subcategory, index) => {
    const offset = index * 3;
    values.push(classId, subcategory.name, subcategory.sort_order);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  await client.query(
    `
      INSERT INTO class_subcategories (class_id, name, sort_order)
      VALUES ${placeholders.join(', ')}
    `,
    values
  );
}

async function getClasses() {
  await ensureSchema();

  const result = await pool.query(`
    SELECT
      c.class_id,
      c.class_name,
      c.description,
      c.image_path,
      c.sort_order,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'subcategory_id', cs.subcategory_id,
            'name', cs.name,
            'sort_order', cs.sort_order
          )
          ORDER BY cs.sort_order ASC, cs.subcategory_id ASC
        ) FILTER (WHERE cs.subcategory_id IS NOT NULL),
        '[]'::json
      ) AS subcategories
    FROM classes c
    LEFT JOIN class_subcategories cs ON cs.class_id = c.class_id
    GROUP BY c.class_id
    ORDER BY c.sort_order ASC, c.class_id ASC
  `);

  return result.rows;
}

router.get('/', async (_req, res) => {
  try {
    const rows = await getClasses();
    res.json(rows);
  } catch (err) {
    console.error('Class fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/count', async (_req, res) => {
  try {
    await ensureSchema();
    const result = await pool.query('SELECT COUNT(*) FROM classes');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ totalClasses: count });
  } catch (err) {
    console.error('Classes count error:', err.message);
    res.status(500).json({ error: 'Бүлгийн тоог авахад алдаа гарлаа' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await ensureSchema();
    const result = await pool.query(`
      SELECT
        c.class_id,
        c.class_name,
        c.description,
        c.image_path,
        c.sort_order,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'subcategory_id', cs.subcategory_id,
              'name', cs.name,
              'sort_order', cs.sort_order
            )
            ORDER BY cs.sort_order ASC, cs.subcategory_id ASC
          ) FILTER (WHERE cs.subcategory_id IS NOT NULL),
          '[]'::json
        ) AS subcategories
      FROM classes c
      LEFT JOIN class_subcategories cs ON cs.class_id = c.class_id
      WHERE c.class_id = $1
      GROUP BY c.class_id
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Бүлэг олдсонгүй' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Class detail error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    await ensureSchema();

    if (!req.file) {
      return res.status(400).json({ error: 'Зураг оруулаагүй байна' });
    }

    return res.json({
      image_path: `image/${path.basename(req.file.path)}`,
    });
  } catch (err) {
    console.error('Class image upload error:', err);
    return res.status(500).json({ error: 'Зураг хадгалахад алдаа гарлаа' });
  }
});

router.post('/create', async (req, res) => {
  const {
    class_name,
    description = '',
    image_path = '',
    sort_order = 0,
    subcategories = [],
  } = req.body;

  const client = await pool.connect();

  try {
    await ensureSchema();
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT class_id FROM classes WHERE LOWER(class_name) = LOWER($1)',
      [class_name]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Ийм нэрээр бүртгэгдсэн байна' });
    }

    const insertResult = await client.query(
      `
        INSERT INTO classes (class_name, description, image_path, sort_order)
        VALUES ($1, $2, $3, $4)
        RETURNING class_id
      `,
      [class_name, description, image_path, Number(sort_order) || 0]
    );

    const classId = insertResult.rows[0].class_id;

    await insertSubcategories(client, classId, subcategories);
    await client.query('COMMIT');

    const rows = await getClasses();
    const created = rows.find((item) => Number(item.class_id) === Number(classId));

    return res.status(201).json(created || { class_id: classId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Class create error:', err);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

router.put('/edit', async (req, res) => {
  const {
    class_id,
    class_name,
    description = '',
    image_path = '',
    sort_order = 0,
    subcategories = [],
  } = req.body;

  const client = await pool.connect();

  try {
    await ensureSchema();
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT class_id FROM classes WHERE LOWER(class_name) = LOWER($1) AND class_id != $2',
      [class_name, class_id]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Ийм нэртэй бүлэг аль хэдийн бүртгэгдсэн байна' });
    }

    const updateResult = await client.query(
      `
        UPDATE classes
        SET class_name = $1, description = $2, image_path = $3, sort_order = $4
        WHERE class_id = $5
        RETURNING class_id
      `,
      [class_name, description, image_path, Number(sort_order) || 0, class_id]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Бүлэг олдсонгүй' });
    }

    await client.query('DELETE FROM class_subcategories WHERE class_id = $1', [class_id]);
    await insertSubcategories(client, Number(class_id), subcategories);

    await client.query('COMMIT');

    const rows = await getClasses();
    const updated = rows.find((item) => Number(item.class_id) === Number(class_id));

    return res.json(updated || { class_id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Class update error:', err);
    return res.status(500).json({ error: 'Серверийн алдаа' });
  } finally {
    client.release();
  }
});

router.delete('/:id', async (req, res) => {
  const class_id = req.params.id;

  try {
    await ensureSchema();

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

    const deleteResult = await pool.query(
      'DELETE FROM classes WHERE class_id = $1',
      [class_id]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Бүлэг олдсонгүй' });
    }

    return res.json({ success: true, message: 'Бүлэг амжилттай устлаа' });
  } catch (err) {
    console.error('Бүлэг устгахад алдаа гарлаа:', err);
    return res.status(500).json({ error: 'Серверийн алдаа' });
  }
});

module.exports = router;

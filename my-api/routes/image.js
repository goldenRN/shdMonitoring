const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Зураг хадгалах тохиргоо
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/ndc-user/image'); // серверийн хадгалах зам
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // давхардалгүй нэр
  },
});

const upload = multer({ storage: storage });

// Олон зураг хүлээж авах route
router.post('/upload', upload.array('images'), async (req, res) => {
  const files = req.files; // олон файл
  const newsid = req.body.newsid;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Зураг оруулаагүй байна' });
  }

  try {
    // Файлуудын замыг хадгалах
    const inserted = [];

    for (const file of files) {
      const result = await pool.query(
        'INSERT INTO image (imagepath, newsid) VALUES ($1, $2) RETURNING *',
        [file.path, newsid]
      );
      inserted.push(result.rows[0]);
    }

    res.status(200).json({ message: 'Амжилттай', data: inserted });
  } catch (err) {
    console.error('Image upload алдаа:', err);
    res.status(500).json({ error: 'Серверийн алдаа' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await pool.query('SELECT id FROM admin_users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        else {
            // 1. Нууц үг хэшлэх
            const hashedPassword = await bcrypt.hash(password, 8);

            // 2. Хэрэглэгчийг үүсгэх
            const userResult = await pool.query(
                'INSERT INTO admin_users (username, password) VALUES ($1, $2) RETURNING id',
                [username, hashedPassword]
            );

            const userId = userResult.rows[0].id;

            // 3. Анхны todo нэмэх (шаардлагатай бол)
            // const defaultTodo = 'Hello :) Add your first todo!';
            // await pool.query(
            //     'INSERT INTO todos (user_id, task) VALUES ($1, $2)',
            //     [userId, defaultTodo]
            // );

            // 4. JWT токен үүсгэх
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.json({ token });
        }

    } catch (err) {
        console.error(err.message);
        res.status(503).send('Server error during registration');
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
console.log("namepass==",username ,password);
    try {
        const userResult = await pool.query(
            'SELECT * FROM admin_users WHERE username = $1',
            [username]
        );

        const user = userResult.rows[0];
        console.log("user==",user);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(503).send('Server error during login');
    }
});

// POST /api/auth/change-password
app.post("/change-password", async (req, res) => {
  const { oldPassword, newPassword, userId } = req.body;

  try {
    // 1. Хэрэглэгчийн одоогийн нууц үг авах
    const result = await pool.query(
      "SELECT password FROM admin_users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }

    const hashedPassword = result.rows[0].password;

    // 2. Хуучин нууц үг шалгах
    const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Хуучин нууц үг буруу байна" });
    }

    // 3. Шинэ нууц үг хадгалах
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE admin_users SET password = $1 WHERE id = $2", [
      newHashedPassword,
      userId,
    ]);

    return res.json({ message: "Нууц үг амжилттай шинэчлэгдлээ ✅" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
});

module.exports = router;
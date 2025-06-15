


const express = require('express');
const app = express();
const authRoute = require('./routes/authRoutes');
const postsRoute = require('./routes/postRoutes');
const khorooRoute = require('./routes/khorooRoutes');

require('dotenv').config();

// UTF-8 charset-ийг автоматаар дэмжинэ
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors()); // бүх origin зөвшөөрнө

app.use('/api/auth', authRoute);
app.use('/api/khoroo', khorooRoute);
app.use('/api/posts', postsRoute);
// app.get('/', (req, res) => {
//     res.send('API is working!');
//   });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
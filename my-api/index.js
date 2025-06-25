const express = require('express');
const app = express();
const authRoute = require('./routes/authRoutes');
const postsRoute = require('./routes/postRoutes');
const khorooRoute = require('./routes/khorooRoutes');
const branchRoute = require('./routes/branchRoutes');
const sourceRoute = require('./routes/sourceRoutes');
const supervisorRoute = require('./routes/supervisorRoutes');
const workprogresRoute = require('./routes/workprogresRoutes');
const imageRoutes = require('./routes/image');

require('dotenv').config();

// UTF-8 charset-ийг автоматаар дэмжинэ
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors()); // бүх origin зөвшөөрнө


app.use('/api/image', imageRoutes);
app.use('/api/auth', authRoute);
app.use('/api/khoroo', khorooRoute);
app.use('/api/branch', branchRoute);
app.use('/api/source', sourceRoute);
app.use('/api/supervisor', supervisorRoute);
app.use('/api/posts', postsRoute);
app.use('/api/workprogress', workprogresRoute);
// app.get('/', (req, res) => {
//     res.send('API is working!');
//   });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // console.log(Server running on port ${PORT});
});
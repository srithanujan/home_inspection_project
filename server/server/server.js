const express = require('express');
const connectDB = require('./config/dbconn.config');
const inspecRoutes = require('./routes/inspectionRoutes');
const imageRoutes = require('./routes/image.route');
const cors = require('cors');
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());


app.use('/inspection', inspecRoutes);
app.use('/img', imageRoutes);


connectDB();


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

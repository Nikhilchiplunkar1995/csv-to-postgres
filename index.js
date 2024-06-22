const express = require('express');
const csvController = require('./controllers/csvController');

const app = express();
const port = 3000;

app.use('/api', csvController);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

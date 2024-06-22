const express = require('express');
const csvService = require('../services/csvService');

const router = express.Router();

router.get('/upload', async (req, res) => {
  try {
    await csvService.uploadCsvData();
    res.send('CSV data uploaded and age distribution calculated.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the CSV file.');
  }
});

module.exports = router;

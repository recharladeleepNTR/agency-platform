const express = require('express');
const router = express.Router();
const { getApplications, createApplication } = require('../controllers/applicationController');

router.route('/')
  .get(getApplications)
  .post(createApplication);

module.exports = router;

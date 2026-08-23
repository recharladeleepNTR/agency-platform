const express = require('express');
const router = express.Router();
const { getApplications, createApplication, deleteApplication } = require('../controllers/applicationController');

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .delete(deleteApplication);

module.exports = router;

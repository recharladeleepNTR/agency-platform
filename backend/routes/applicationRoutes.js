const express = require('express');
const router = express.Router();
const { getApplications, createApplication, deleteApplication } = require('../controllers/applicationController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protectAdmin, getApplications)
  .post(createApplication);

router.route('/:id')
  .delete(protectAdmin, deleteApplication);

module.exports = router;

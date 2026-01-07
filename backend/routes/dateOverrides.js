const express = require('express');
const router = express.Router();
const {
  getAllDateOverrides,
  createDateOverride,
  updateDateOverride,
  deleteDateOverride
} = require('../controllers/dateOverrideController');

router.get('/', getAllDateOverrides);
router.post('/', createDateOverride);
router.put('/:id', updateDateOverride);
router.delete('/:id', deleteDateOverride);

module.exports = router;

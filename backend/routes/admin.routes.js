const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadPDF, getStats, seedGDPRData } = require('../controllers/admin.controller');

router.use(protect, adminOnly);
router.post('/upload-pdf', uploadPDF);
router.get('/stats', getStats);
router.post('/seed', seedGDPRData);

module.exports = router;

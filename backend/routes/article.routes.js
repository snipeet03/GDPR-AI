const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { getArticles, getArticle, searchArticles, getStats } = require('../controllers/article.controller');

router.use(protect);
router.get('/', getArticles);
router.get('/search', searchArticles);
router.get('/stats', getStats);
router.get('/:number', getArticle);

module.exports = router;

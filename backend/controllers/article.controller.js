const Article = require('../models/Article');
const { semanticSearch } = require('../services/embedding.service');

exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    const articles = await Article.find(query)
      .select('articleNumber title summary keywords chapter')
      .sort({ articleNumber: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    const total = await Article.countDocuments(query);
    res.json({ articles, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ articleNumber: req.params.number, isActive: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ article });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.searchArticles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const results = await semanticSearch(q, 8);
    res.json({ results });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [articleCount, chunkCount] = await Promise.all([
      Article.countDocuments({ isActive: true }),
      require('../models/PDFChunk').countDocuments()
    ]);
    res.json({ articleCount, chunkCount, status: 'ready' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

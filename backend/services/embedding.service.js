/**
 * Embedding Service
 * Uses TF-IDF based similarity with keyword extraction for free, local semantic search.
 * For production, can be replaced with sentence-transformers via Python microservice
 * or Hugging Face Inference API (all-MiniLM-L6-v2).
 */

const Article = require('../models/Article');
const PDFChunk = require('../models/PDFChunk');

// GDPR-specific keyword weights for better relevance
const GDPR_KEYWORDS = {
  'article 5': 10, 'article 25': 10, 'article 30': 10, 'article 32': 10,
  'article 33': 10, 'article 35': 10, 'data protection': 8, 'gdpr': 8,
  'personal data': 7, 'processing': 6, 'consent': 7, 'breach': 8,
  'encryption': 7, 'aes-256': 8, 'tls': 7, 'zero trust': 9,
  'stride': 8, 'incident': 7, 'containment': 7, 'recovery': 6,
  'dpo': 7, 'data minimization': 8, 'privacy by design': 9,
  'pseudonymization': 8, 'anonymization': 8, 'controller': 6,
  'processor': 6, 'supervisory authority': 7, 'dpia': 9,
  'legitimate interest': 7, 'data subject': 7, 'right to erasure': 8,
  'right to access': 7, 'portability': 6, 'profiling': 7,
  'third party': 5, 'transfer': 6, 'adequacy decision': 7,
  'ransomware': 8, 'phishing': 7, 'mfa': 7, 'rbac': 7,
  'iam': 7, 'siem': 7, 'hospital': 6, 'healthcare': 6,
  'ehr': 7, 'iomt': 7, 'hipaa': 7, 'security': 5
};

/**
 * Tokenize and normalize text
 */
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
};

/**
 * Build bigrams from tokens
 */
const getBigrams = (tokens) => {
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
};

/**
 * Calculate TF-IDF-like relevance score between query and document
 */
const calculateRelevanceScore = (query, document) => {
  const queryTokens = tokenize(query);
  const queryBigrams = getBigrams(queryTokens);
  const docTokens = tokenize(document);
  const docBigrams = getBigrams(docTokens);
  const docText = document.toLowerCase();

  let score = 0;

  // Unigram matching
  for (const token of queryTokens) {
    const count = docTokens.filter(t => t === token).length;
    if (count > 0) {
      const idf = Math.log(1000 / (count + 1));
      score += (count / docTokens.length) * idf;
    }
  }

  // Bigram matching (phrase matching bonus)
  for (const bigram of queryBigrams) {
    if (docBigrams.includes(bigram)) {
      score += 2.0;
    }
    // GDPR keyword bonus
    if (GDPR_KEYWORDS[bigram]) {
      const queryHasBigram = queryBigrams.includes(bigram) || query.toLowerCase().includes(bigram);
      if (queryHasBigram && docText.includes(bigram)) {
        score += GDPR_KEYWORDS[bigram] * 0.5;
      }
    }
  }

  // GDPR keyword bonus for exact phrase matches
  for (const [keyword, weight] of Object.entries(GDPR_KEYWORDS)) {
    if (query.toLowerCase().includes(keyword) && docText.includes(keyword)) {
      score += weight * 0.3;
    }
  }

  // Exact phrase bonus
  const queryPhrases = query.toLowerCase().match(/["']([^"']+)["']/g);
  if (queryPhrases) {
    for (const phrase of queryPhrases) {
      const clean = phrase.replace(/["']/g, '');
      if (docText.includes(clean)) score += 5.0;
    }
  }

  return score;
};

/**
 * Semantic search across all knowledge sources
 */
const semanticSearch = async (query, topK = 5) => {
  try {
    const [articles, pdfChunks] = await Promise.all([
      Article.find({ isActive: true }).select('articleNumber title content keywords summary').lean(),
      PDFChunk.find({}).select('content documentName metadata').lean()
    ]);

    const results = [];

    // Score articles
    for (const article of articles) {
      const text = `${article.title} ${article.content} ${(article.keywords || []).join(' ')}`;
      const score = calculateRelevanceScore(query, text);
      if (score > 0.1) {
        results.push({
          id: article._id,
          source: `GDPR ${article.articleNumber}: ${article.title}`,
          content: article.content.substring(0, 600),
          articleNumber: article.articleNumber,
          title: article.title,
          type: 'article',
          score
        });
      }
    }

    // Score PDF chunks
    for (const chunk of pdfChunks) {
      const score = calculateRelevanceScore(query, chunk.content);
      if (score > 0.1) {
        results.push({
          id: chunk._id,
          source: `Cybersecurity Framework: ${chunk.documentName}`,
          content: chunk.content.substring(0, 600),
          type: 'pdf',
          section: chunk.metadata?.section || '',
          score
        });
      }
    }

    // Sort by score and return top K
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);

  } catch (error) {
    console.error('Semantic search error:', error);
    return [];
  }
};

/**
 * Find related articles for a given article
 */
const findRelatedArticles = async (articleId, limit = 3) => {
  const article = await Article.findById(articleId).lean();
  if (!article) return [];

  const allArticles = await Article.find({ 
    _id: { $ne: articleId }, 
    isActive: true 
  }).lean();

  const query = `${article.title} ${(article.keywords || []).join(' ')}`;
  const scored = allArticles.map(a => ({
    ...a,
    score: calculateRelevanceScore(query, `${a.title} ${a.content}`)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

module.exports = { semanticSearch, findRelatedArticles, calculateRelevanceScore };

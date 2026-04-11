const Article = require('../models/Article');
const PDFChunk = require('../models/PDFChunk');
const pdfParse = require('pdf-parse');

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.body.pdfBase64) return res.status(400).json({ error: 'PDF data required' });
    const buffer = Buffer.from(req.body.pdfBase64, 'base64');
    const data = await pdfParse(buffer);
    const text = data.text;
    
    // Chunk the text
    const chunkSize = 800;
    const overlap = 100;
    const chunks = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + chunkSize));
      i += chunkSize - overlap;
    }

    const docName = req.body.documentName || 'uploaded-document';
    await PDFChunk.deleteMany({ documentName: docName });
    
    const docs = chunks.map((content, idx) => ({ documentName: docName, chunkIndex: idx, content, source: 'pdf' }));
    await PDFChunk.insertMany(docs);

    res.json({ success: true, chunks: chunks.length, documentName: docName });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [articles, chunks, users, chats] = await Promise.all([
      Article.countDocuments(),
      PDFChunk.countDocuments(),
      require('../models/User').countDocuments(),
      require('../models/Chat').countDocuments()
    ]);
    res.json({ articles, chunks, users, chats });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.seedGDPRData = async (req, res) => {
  try {
    const count = await Article.countDocuments();
    if (count > 0) return res.json({ message: 'Data already seeded', count });
    
    // Import and run seed
    const { seedArticles } = require('../scripts/seedData');
    const result = await seedArticles();
    res.json({ success: true, ...result });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

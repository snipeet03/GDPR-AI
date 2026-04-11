const mongoose = require('mongoose');

const pdfChunkSchema = new mongoose.Schema({
  documentName: {
    type: String,
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    default: []
  },
  metadata: {
    page: Number,
    section: String,
    keywords: [String]
  },
  source: {
    type: String,
    default: 'pdf'
  }
}, {
  timestamps: true
});

pdfChunkSchema.index({ documentName: 1, chunkIndex: 1 });
pdfChunkSchema.index({ content: 'text' });

const PDFChunk = mongoose.model('PDFChunk', pdfChunkSchema);
module.exports = PDFChunk;

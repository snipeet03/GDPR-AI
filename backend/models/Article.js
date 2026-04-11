const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  keywords: [{
    type: String,
    lowercase: true
  }],
  url: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['gdpr-website', 'pdf', 'manual'],
    default: 'gdpr-website'
  },
  embedding: {
    type: [Number],
    default: []
  },
  chapter: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text search index
articleSchema.index({ title: 'text', content: 'text', keywords: 'text' });

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;

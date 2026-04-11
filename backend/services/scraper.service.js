const axios = require('axios')
const cheerio = require('cheerio')
const Article = require('../models/Article')

/**
 * Scrape GDPR articles from gdpr-info.eu
 * Used as an optional enhancement to the seeded data
 */
const scrapeGDPRArticle = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GDPR-Assistant/1.0)' },
      timeout: 10000
    })
    const $ = cheerio.load(data)
    const title = $('h1').first().text().trim()
    const content = $('.entry-content p').map((_, el) => $(el).text().trim()).get().join('\n')
    return { title, content }
  } catch (err) {
    console.error(`Scrape error for ${url}:`, err.message)
    return null
  }
}

module.exports = { scrapeGDPRArticle }

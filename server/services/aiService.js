const { pipeline } = require('@xenova/transformers');
const { NlpManager } = require('node-nlp');
const axios = require('axios');

class AIService {
  constructor() {
    this.nlp = null;
    this.summarizer = null;
    this.initialized = false;
    this.initializing = false;
  }

  async initialize() {
    if (this.initialized || this.initializing) return;
    
    this.initializing = true;
    
    try {
      console.log('🤖 Initializing AI models...');
      
      // Initialize NLP manager
      this.nlp = new NlpManager({ languages: ['en'] });
      
      // Train NLP model with some basic patterns
      await this.nlp.addDocument('en', 'technology', 'tech');
      await this.nlp.addDocument('en', 'programming', 'tech');
      await this.nlp.addDocument('en', 'software', 'tech');
      await this.nlp.addDocument('en', 'news', 'news');
      await this.nlp.addDocument('en', 'article', 'news');
      await this.nlp.addDocument('en', 'blog', 'blog');
      await this.nlp.addDocument('en', 'tutorial', 'education');
      await this.nlp.addDocument('en', 'learning', 'education');
      
      await this.nlp.train();
      
      // Initialize summarization model in background (non-blocking)
      this.initializeSummarizer();
      
      this.initialized = true;
      console.log('✅ AI models initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing AI models:', error);
      // Continue without AI features if models fail to load
    } finally {
      this.initializing = false;
    }
  }

  async initializeSummarizer() {
    try {
      this.summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
      console.log('✅ Summarization model loaded');
    } catch (error) {
      console.warn('⚠️ Summarization model failed to load:', error.message);
    }
  }

  async extractMetadata(url, htmlContent = null) {
    // Don't wait for initialization - return basic metadata immediately
    const metadata = {
      title: '',
      description: '',
      keywords: [],
      category: 'general',
      suggestedAlias: this.generateSuggestedAlias('', url)
    };

    try {
      // Extract basic metadata from HTML if provided
      if (htmlContent) {
        metadata.title = this.extractTitle(htmlContent);
        metadata.description = this.extractDescription(htmlContent);
      }

      // If no title from HTML, try to generate one from URL
      if (!metadata.title) {
        metadata.title = this.generateTitleFromUrl(url);
      }

      // Update suggested alias with title
      metadata.suggestedAlias = this.generateSuggestedAlias(metadata.title, url);

      // Try to initialize AI models in background
      this.initialize().catch(console.error);

    } catch (error) {
      console.error('Error in metadata extraction:', error);
    }

    return metadata;
  }

  extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  extractDescription(html) {
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    return descMatch ? descMatch[1].trim() : '';
  }

  extractTextContent(html) {
    // Remove script and style tags
    const cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                          .replace(/<[^>]+>/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim();
    return cleanHtml;
  }

  generateTitleFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      const pathname = urlObj.pathname.replace(/\//g, ' ').trim();
      
      if (pathname) {
        return `${hostname} - ${pathname.split(' ').slice(0, 3).join(' ')}`;
      }
      return hostname;
    } catch (error) {
      return 'Untitled';
    }
  }

  async generateSummary(text) {
    if (!this.summarizer || text.length < 100) return '';
    
    try {
      const result = await this.summarizer(text, {
        max_length: 150,
        min_length: 30,
        do_sample: false
      });
      return result[0]?.summary_text || '';
    } catch (error) {
      console.warn('Summary generation failed:', error.message);
      return '';
    }
  }

  async extractKeywords(text) {
    if (!this.nlp || !text) return [];
    
    try {
      const result = await this.nlp.process('en', text);
      const keywords = [];
      
      // Extract nouns and important words
      const words = text.toLowerCase().match(/\b\w+\b/g) || [];
      const wordFreq = {};
      
      words.forEach(word => {
        if (word.length > 3) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
      
      // Get top 5 most frequent words
      const sortedWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);
      
      return sortedWords;
    } catch (error) {
      console.warn('Keyword extraction failed:', error.message);
      return [];
    }
  }

  async categorizeContent(text) {
    if (!this.nlp || !text) return 'general';
    
    try {
      const result = await this.nlp.process('en', text);
      return result.intent || 'general';
    } catch (error) {
      console.warn('Content categorization failed:', error.message);
      return 'general';
    }
  }

  generateSuggestedAlias(title, url) {
    try {
      if (title) {
        return title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 20);
      }
      
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      const pathname = urlObj.pathname.replace(/\//g, '-').replace(/^-|-$/g, '');
      
      if (pathname) {
        return `${hostname}-${pathname}`.substring(0, 20);
      }
      return hostname.substring(0, 20);
    } catch (error) {
      return 'link';
    }
  }

  async analyzeUrlContent(url) {
    try {
      // Try to fetch the URL content
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SmartShort/1.0)'
        }
      });
      
      const htmlContent = response.data;
      return await this.extractMetadata(url, htmlContent);
      
    } catch (error) {
      console.warn('Failed to fetch URL content:', error.message);
      // Return basic metadata without content analysis
      return await this.extractMetadata(url);
    }
  }
}

module.exports = new AIService(); 
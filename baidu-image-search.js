/**
 * Baidu Image Search Library
 * Browser-compatible version for searching museum and treasure photos
 * Uses letmetry.cloud image search API for reliable Baidu image results
 * 
 * Usage:
 *   const searcher = new BaiduImageSearch();
 *   const results = await searcher.searchMuseumPhotos('故宫博物院');
 *   const treasureResults = await searcher.searchTreasurePhotos('故宫博物院', '清明上河图');
 */

class BaiduImageSearch {
  constructor() {
    // letmetry.cloud image search API endpoint
    this.apiEndpoint = 'https://letmetry.cloud/image/search';
    this.defaultImageCount = 10;
  }

  /**
   * Search images using letmetry.cloud API
   * @param {string} query - Search query (keyword)
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Array of image results
   */
  async searchBaiduImages(query, limit = this.defaultImageCount) {
    console.log(`🔍 使用 letmetry.cloud API 搜索图片: ${query}`);
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword: query,
          count: limit * 2  // Request more to account for filtering
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the API response
      const images = this.parseApiResponse(data, limit);
      
      if (images.length > 0) {
        console.log(`✅ 从百度找到 ${images.length} 个图片`);
        return images;
      }
      
      throw new Error('No images found in response');
      
    } catch (error) {
      console.error(`❌ 图片搜索失败: ${error.message}`);
      throw new Error('无法获取百度图片搜索结果，请尝试点击"去百度搜索"手动查找');
    }
  }

  /**
   * Parse the letmetry.cloud API response
   * @param {Object|Array} data - API response data
   * @param {number} limit - Maximum number of results
   * @returns {Array} - Parsed image results
   */
  parseApiResponse(data, limit) {
    const results = [];
    
    // Handle both array responses and object responses with data/images field
    let items = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data.data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data.images && Array.isArray(data.images)) {
      items = data.images;
    } else if (data.results && Array.isArray(data.results)) {
      items = data.results;
    }
    
    for (const item of items) {
      if (results.length >= limit) break;
      
      // Try different field names for the image URL
      const imageUrl = item.url || item.objURL || item.thumbURL || item.middleURL || item.hoverURL || item.image || item.src;
      const thumbUrl = item.thumbnailUrl || item.thumbnail || item.thumbURL || item.middleURL || imageUrl;
      
      if (!imageUrl || !imageUrl.startsWith('http')) continue;
      
      // Filter out known ad/placeholder images
      if (this.isAdImage(imageUrl)) continue;
      
      results.push({
        url: imageUrl,
        thumbnailUrl: thumbUrl,
        name: item.title || item.name || item.fromPageTitleEnc || item.fromPageTitle || '百度图片',
        width: item.width || 0,
        height: item.height || 0,
        hostPageUrl: item.hostPageUrl || item.fromURLEnc || item.fromURL || item.sourceUrl || '',
        source: 'baidu'
      });
    }
    
    return results;
  }

  /**
   * Check if URL is an ad or placeholder image
   * Filters out common Baidu UI elements and low-quality thumbnails
   * @param {string} url - Image URL
   * @returns {boolean} - Whether it's an ad image
   */
  isAdImage(url) {
    // Patterns to filter out non-content images from Baidu search results:
    // - emoji.cdn.bcebos.com: Baidu emoji CDN
    // - ns-strategy: Baidu strategy/ad images
    // - baseimg: Base UI elements
    // - yunque: Baidu cloud service images
    // - logo/icon/placeholder: Generic UI elements
    // - data:image: Inline data URLs (usually small icons)
    // - size=f60/w60/f40: Very small thumbnails (60px or 40px)
    const adPatterns = [
      'emoji.cdn.bcebos.com',
      'ns-strategy',
      'baseimg',
      'yunque',
      'logo',
      'icon',
      'placeholder',
      'data:image',
      'size=f60',
      'size=w60',
      'size=f40'
    ];
    
    return adPatterns.some(pattern => url.includes(pattern));
  }

  /**
   * Search for museum building photos
   * @param {string} museumName - Name of the museum
   * @returns {Promise<Array>} - Array of image objects
   */
  async searchMuseumPhotos(museumName) {
    console.log(`🏛️ 百度搜索博物馆照片: ${museumName}`);
    
    // Optimized search query for museum buildings
    const query = `${museumName} 博物馆 外观 建筑`;
    
    try {
      const results = await this.searchBaiduImages(query, this.defaultImageCount);
      
      return results.map((img, index) => ({
        index: index + 1,
        url: img.url,
        thumbnailUrl: img.thumbnailUrl,
        name: img.name,
        hostPageUrl: img.hostPageUrl,
        width: img.width,
        height: img.height,
        source: 'baidu'
      }));
    } catch (error) {
      console.error('百度博物馆图片搜索失败:', error);
      throw error;
    }
  }

  /**
   * Search for treasure/collection photos
   * @param {string} museumName - Name of the museum (optional, for context)
   * @param {string} treasureName - Name of the treasure
   * @returns {Promise<Array>} - Array of image objects
   */
  async searchTreasurePhotos(museumName, treasureName) {
    console.log(`🎨 百度搜索文物照片: ${treasureName}`);
    
    // Optimized search query for treasures
    const query = museumName 
      ? `${treasureName} ${museumName} 文物 高清`
      : `${treasureName} 文物 高清`;
    
    try {
      const results = await this.searchBaiduImages(query, this.defaultImageCount);
      
      return results.map((img, index) => ({
        index: index + 1,
        url: img.url,
        thumbnailUrl: img.thumbnailUrl,
        name: img.name,
        hostPageUrl: img.hostPageUrl,
        width: img.width,
        height: img.height,
        source: 'baidu'
      }));
    } catch (error) {
      console.error('百度文物图片搜索失败:', error);
      throw error;
    }
  }

  /**
   * Helper function to delay execution
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Make it available globally for browser usage
if (typeof window !== 'undefined') {
  window.BaiduImageSearch = BaiduImageSearch;
}

// Also export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaiduImageSearch;
}

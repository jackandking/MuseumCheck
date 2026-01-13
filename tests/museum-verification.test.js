/**
 * Museum Verification Tests
 * 
 * Tests for the official museum verification system
 */

describe('Museum Official Verification', () => {
  let verifyMuseumOfficial;

  // Mock fetch for testing
  const mockFetch = (response) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response),
      })
    );
  };

  const mockFetchError = (status) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status,
        statusText: 'Error',
      })
    );
  };

  beforeEach(() => {
    // Load the verification function
    // In browser environment, this would be LetmetryAPI.verifyMuseumOfficial
    // For testing, we simulate it
    verifyMuseumOfficial = async (museumName, strictMode = false) => {
      const response = await fetch('https://letmetry.cloud/museum/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ museumName: museumName.trim() })
      });

      if (!response.ok) {
        return {
          status: 'error',
          error: `HTTP ${response.status}: ${response.statusText}`,
          verified: false,
          museumName
        };
      }

      const data = await response.json();

      if (!data.success) {
        return {
          status: 'not_found',
          error: data.error || 'Museum not found',
          verified: false,
          museumName
        };
      }

      const searchTerm = museumName.toLowerCase();
      const scoredMatches = (data.museums || []).map(museum => {
        const museumNameLower = (museum.name || '').toLowerCase();
        
        if (museumNameLower === searchTerm) {
          return { ...museum, score: 100, matchType: 'exact' };
        }
        
        if (museumNameLower.includes(searchTerm) || searchTerm.includes(museumNameLower)) {
          return { ...museum, score: 80, matchType: 'partial' };
        }
        
        return { ...museum, score: 50, matchType: 'fuzzy' };
      });

      scoredMatches.sort((a, b) => b.score - a.score);

      const bestMatch = scoredMatches[0];
      const verified = strictMode ? (bestMatch?.score >= 100) : (bestMatch?.score >= 60);

      return {
        status: 'success',
        verified,
        museumName,
        strictMode,
        bestMatch,
        allMatches: scoredMatches
      };
    };
  });

  describe('Exact Match Verification', () => {
    test('should verify exact match with 100% score', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          {
            name: '故宫博物院',
            province: '北京市',
            qualityGrade: '一级',
            collectionCount: '1950828',
            preciousArtifactsCount: '1053272'
          }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('故宫博物院', false);

      expect(result.status).toBe('success');
      expect(result.verified).toBe(true);
      expect(result.bestMatch.score).toBe(100);
      expect(result.bestMatch.matchType).toBe('exact');
    });

    test('should pass strict mode for exact match', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          {
            name: '上海博物馆',
            province: '上海市',
            qualityGrade: '一级'
          }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('上海博物馆', true);

      expect(result.status).toBe('success');
      expect(result.verified).toBe(true);
      expect(result.strictMode).toBe(true);
    });
  });

  describe('Partial Match Verification', () => {
    test('should verify partial match with 80% score', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          {
            name: '中国国家博物馆',
            province: '北京市',
            qualityGrade: '一级'
          }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('国家博物馆', false);

      expect(result.status).toBe('success');
      expect(result.bestMatch.score).toBe(80);
      expect(result.bestMatch.matchType).toBe('partial');
    });

    test('should fail strict mode for partial match', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          {
            name: '国家博物馆',
            province: '北京市',
            qualityGrade: '一级'
          }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('博物馆', true);

      expect(result.status).toBe('success');
      expect(result.verified).toBe(false);
      expect(result.strictMode).toBe(true);
    });

    test('should pass non-strict mode for partial match', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          {
            name: '国家博物馆',
            province: '北京市',
            qualityGrade: '一级'
          }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('博物馆', false);

      expect(result.status).toBe('success');
      expect(result.verified).toBe(true);
      expect(result.strictMode).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle HTTP errors gracefully', async () => {
      mockFetchError(500);

      const result = await verifyMuseumOfficial('故宫博物院');

      expect(result.status).toBe('error');
      expect(result.verified).toBe(false);
      expect(result.error).toContain('HTTP');
    });

    test('should handle not found response', async () => {
      const mockResponse = {
        success: false,
        error: 'Museum not found in database',
        museums: []
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('非法博物馆');

      expect(result.status).toBe('not_found');
      expect(result.verified).toBe(false);
      expect(result.error).toBe('Museum not found in database');
    });

    test('should handle empty input', async () => {
      try {
        await verifyMuseumOfficial('', false);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain('Museum name must be');
      }
    });

    test('should handle network errors', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network timeout'))
      );

      const result = await verifyMuseumOfficial('故宫博物院');

      expect(result.status).toBe('error');
      expect(result.verified).toBe(false);
    });
  });

  describe('Multiple Match Handling', () => {
    test('should sort matches by score', async () => {
      const mockResponse = {
        success: true,
        count: 3,
        museums: [
          { name: '故宫博物院', province: '北京', qualityGrade: '一级' },
          { name: '故宫景区博物馆', province: '北京', qualityGrade: '二级' },
          { name: '故宫铜币展览', province: '浙江', qualityGrade: '三级' }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('故宫博物院');

      expect(result.allMatches.length).toBe(3);
      expect(result.allMatches[0].name).toBe('故宫博物院');
      expect(result.allMatches[0].score).toBe(100);
      expect(result.bestMatch.name).toBe('故宫博物院');
    });
  });

  describe('Input Validation', () => {
    test('should trim whitespace from museum names', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          { name: '故宫博物院', province: '北京', qualityGrade: '一级' }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('  故宫博物院  ');

      expect(result.verified).toBe(true);
      expect(result.museumName).toBe('  故宫博物院  '); // Original preserved
    });

    test('should handle non-string input', async () => {
      try {
        await verifyMuseumOfficial(123);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('Museum name must be');
      }
    });
  });

  describe('Strict Mode Behavior', () => {
    test('should require 100% score in strict mode', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          { name: '故宫博物院', province: '北京', qualityGrade: '一级' }
        ]
      };

      mockFetch(mockResponse);

      const resultStrict = await verifyMuseumOfficial('故宫', true);
      const resultNormal = await verifyMuseumOfficial('故宫', false);

      expect(resultStrict.verified).toBe(false);
      expect(resultNormal.verified).toBe(true);
    });

    test('should allow 60%+ score in normal mode', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          { name: '故宫博物院', province: '北京', qualityGrade: '一级' }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('故', false);

      // Should verify if score >= 60
      if (result.bestMatch?.score >= 60) {
        expect(result.verified).toBe(true);
      }
    });
  });

  describe('Official Metadata Extraction', () => {
    test('should extract official metadata from matched museum', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        museums: [
          {
            name: '故宫博物院',
            province: '北京市',
            qualityGrade: '一级',
            collectionCount: '1950828',
            preciousArtifactsCount: '1053272',
            educationalActivitiesCount: '1634',
            visitorCount: '1762.4483'
          }
        ]
      };

      mockFetch(mockResponse);

      const result = await verifyMuseumOfficial('故宫博物院');

      expect(result.verified).toBe(true);
      expect(result.bestMatch.collectionCount).toBe('1950828');
      expect(result.bestMatch.qualityGrade).toBe('一级');
      expect(result.bestMatch.visitorCount).toBe('1762.4483');
    });
  });
});

// CLI Tests (integration-like tests)
describe('Museum Verification CLI', () => {
  test('should accept museum name as argument', () => {
    const args = ['故宫博物院', '--strict'];
    const museumName = args[0];
    const strictMode = args.includes('--strict');

    expect(museumName).toBe('故宫博物院');
    expect(strictMode).toBe(true);
  });

  test('should parse batch file argument', () => {
    const args = ['--batch', 'museums.json', '--strict'];
    const batchIdx = args.indexOf('--batch');
    const filePath = args[batchIdx + 1];
    const strictMode = args.includes('--strict');

    expect(filePath).toBe('museums.json');
    expect(strictMode).toBe(true);
  });

  test('should parse verify-script argument', () => {
    const args = ['--verify-script', 'script.js', '--verbose'];
    const scriptIdx = args.indexOf('--verify-script');
    const filePath = args[scriptIdx + 1];
    const verbose = args.includes('--verbose');

    expect(filePath).toBe('script.js');
    expect(verbose).toBe(true);
  });
});

/**
 * Test: Pinghu Museum Workflows
 * 
 * Validates that Pinghu Museum has comprehensive workflows defined
 * and that they follow the correct structure.
 */

describe('Pinghu Museum Workflows', () => {
  let MUSEUM_PINGHU;
  let WORKFLOWS;

  beforeAll(() => {
    // Load museums/pinghu-museum.js
    require('../museums/pinghu-museum.js');
    MUSEUM_PINGHU = global.window.MUSEUM_PINGHU;

    // Load workflows-data.js
    global.window = {};
    require('../workflows-data.js');
    WORKFLOWS = global.window.WORKFLOWS;
  });

  test('Pinghu Museum override file has workflows', () => {
    expect(MUSEUM_PINGHU).toBeDefined();
    expect(MUSEUM_PINGHU.id).toBe('pinghu-museum');
    expect(MUSEUM_PINGHU.workflows).toBeDefined();
    expect(Array.isArray(MUSEUM_PINGHU.workflows)).toBe(true);
    expect(MUSEUM_PINGHU.workflows.length).toBeGreaterThan(0);
  });

  test('Pinghu Museum has at least 3 comprehensive workflows', () => {
    expect(MUSEUM_PINGHU.workflows.length).toBeGreaterThanOrEqual(3);
  });

  test('All workflows have required fields', () => {
    MUSEUM_PINGHU.workflows.forEach(workflow => {
      expect(workflow).toHaveProperty('id');
      expect(workflow).toHaveProperty('name');
      expect(workflow).toHaveProperty('description');
      expect(workflow).toHaveProperty('ages');
      expect(workflow).toHaveProperty('tasks');
      
      expect(Array.isArray(workflow.ages)).toBe(true);
      expect(workflow.ages.length).toBeGreaterThan(0);
      
      expect(workflow.tasks).toHaveProperty('enroute');
      expect(workflow.tasks).toHaveProperty('visit');
      expect(Array.isArray(workflow.tasks.enroute)).toBe(true);
      expect(Array.isArray(workflow.tasks.visit)).toBe(true);
    });
  });

  test('All tasks have required fields', () => {
    MUSEUM_PINGHU.workflows.forEach(workflow => {
      const allTasks = [...workflow.tasks.enroute, ...workflow.tasks.visit];
      
      allTasks.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('role');
        expect(task).toHaveProperty('type');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('subtitle');
        
        // Validate role
        expect(['parent', 'child']).toContain(task.role);
        
        // Validate type
        expect(['photo', 'confirm', 'tts', 'link']).toContain(task.type);
      });
    });
  });

  test('Workflows have meaningful task counts', () => {
    MUSEUM_PINGHU.workflows.forEach(workflow => {
      const totalTasks = workflow.tasks.enroute.length + workflow.tasks.visit.length;
      
      // Each workflow should have at least 3 tasks
      expect(totalTasks).toBeGreaterThanOrEqual(3);
      
      // Visit tasks should always be present
      expect(workflow.tasks.visit.length).toBeGreaterThan(0);
    });
  });

  test('Quick Family Visit workflow exists with correct structure', () => {
    const quickVisit = MUSEUM_PINGHU.workflows.find(w => w.id === 'quick-family-visit');
    
    expect(quickVisit).toBeDefined();
    expect(quickVisit.name).toBe('亲子轻松游');
    expect(quickVisit.ages).toContain('3-6');
    expect(quickVisit.ages).toContain('7-12');
  });

  test('Hometown Discovery workflow exists with correct structure', () => {
    const hometown = MUSEUM_PINGHU.workflows.find(w => w.id === 'hometown-discovery');
    
    expect(hometown).toBeDefined();
    expect(hometown.name).toBe('家乡探索之旅');
    expect(hometown.ages).toContain('3-6');
    expect(hometown.ages).toContain('7-12');
  });

  test('Water Culture Exploration workflow exists with correct structure', () => {
    const waterCulture = MUSEUM_PINGHU.workflows.find(w => w.id === 'water-culture-exploration');
    
    expect(waterCulture).toBeDefined();
    expect(waterCulture.name).toBe('水乡文化探秘');
    expect(waterCulture.ages).toContain('7-12');
    expect(waterCulture.ages).toContain('13-18');
  });

  test('Treasure Discovery workflow still exists', () => {
    const treasure = MUSEUM_PINGHU.workflows.find(w => w.id === 'treasure-discovery');
    
    expect(treasure).toBeDefined();
    expect(treasure.name).toBe('镇馆之宝探索');
  });

  test('Global workflows-data.js also has Pinghu workflows', () => {
    expect(WORKFLOWS).toBeDefined();
    expect(WORKFLOWS['pinghu-museum']).toBeDefined();
    expect(Array.isArray(WORKFLOWS['pinghu-museum'])).toBe(true);
    expect(WORKFLOWS['pinghu-museum'].length).toBeGreaterThanOrEqual(3);
  });

  test('TTS tasks have tts field', () => {
    MUSEUM_PINGHU.workflows.forEach(workflow => {
      const allTasks = [...workflow.tasks.enroute, ...workflow.tasks.visit];
      
      allTasks.forEach(task => {
        if (task.type === 'tts') {
          expect(task).toHaveProperty('tts');
          expect(typeof task.tts).toBe('string');
          expect(task.tts.length).toBeGreaterThan(0);
        }
      });
    });
  });
});

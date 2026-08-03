import { ContentModel } from '../models/entities/ContentModel';

describe('ContentModel', () => {
  // Fresh instance per suite so singleton cache state never bleeds between tests
  const model = new ContentModel();

  describe('validateContent', () => {
    test('accepts a valid home payload', () => {
      const result = model.validateContent(
        { title: 'Home', hero: { greeting: 'Hi!' } },
        'home'
      );
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects unknown content types', () => {
      const result = model.validateContent({}, 'nope');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unknown content type: nope');
    });

    test('reports missing required fields', () => {
      const result = model.validateContent({ title: 'Home' }, 'home');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: hero');
    });

    test('reports field type mismatches', () => {
      const result = model.validateContent({ title: 42, hero: {} }, 'home');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Invalid type for title: expected string, got number'
      );
    });

    test('runs custom rules (hero greeting required)', () => {
      const result = model.validateContent({ title: 'Home', hero: {} }, 'home');
      expect(result.errors).toContain('Hero section missing greeting');
    });

    // Regression: the data pipeline flattens projects.categories into items
    // before validation, so the rule must target the transformed shape.
    test('accepts flattened projects payload (items, no categories)', () => {
      const result = model.validateContent(
        { title: 'Projects', items: [{ name: 'ROS Tool' }] },
        'projects'
      );
      expect(result.isValid).toBe(true);
    });

    // Regression: 'about' is aliased from overview at runtime
    test('accepts about payload shaped as professionalOverview', () => {
      const result = model.validateContent(
        { professionalOverview: { title: 'Overview' } },
        'about'
      );
      expect(result.isValid).toBe(true);
    });

    test('accepts contact payload with a title', () => {
      const result = model.validateContent({ title: 'Contact' }, 'contact');
      expect(result.isValid).toBe(true);
    });
  });

  describe('transformContentForDisplay', () => {
    test('splits greeting into words for home', () => {
      const out = model.transformContentForDisplay(
        { title: 'Home', hero: { greeting: 'Hi!There' } },
        'home'
      );
      expect(out.hero.greetingWords).toEqual(['Hi', 'There']);
    });

    test('counts sections for about (excluding title)', () => {
      const out = model.transformContentForDisplay(
        { title: 'About', skills: [], experience: [] },
        'about'
      );
      expect(out.sectionsCount).toBe(2);
    });

    test('sums project totals across categories', () => {
      const out = model.transformContentForDisplay(
        {
          title: 'Projects',
          categories: [{ projects: [1, 2] }, { projects: [3] }],
        },
        'projects'
      );
      expect(out.totalProjects).toBe(3);
    });

    test('sorts articles newest first', () => {
      const out = model.transformContentForDisplay(
        {
          title: 'Articles',
          items: [{ date: '2021-01-01' }, { date: '2023-01-01' }],
        },
        'articles'
      );
      expect(out.items[0].date).toBe('2023-01-01');
    });

    test('passes unknown types through unchanged', () => {
      const content = { a: 1 };
      expect(model.transformContentForDisplay(content, 'unknown')).toBe(content);
    });

    test('returns null for falsy content', () => {
      expect(model.transformContentForDisplay(null, 'home')).toBeNull();
    });
  });

  describe('cacheContent / getCachedContent', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    test('stores and retrieves within TTL', () => {
      model.cacheContent('home', { hello: 'world' }, 1000);
      expect(model.getCachedContent('home')).toEqual({ hello: 'world' });
    });

    test('expires entries after TTL elapses', () => {
      model.cacheContent('home', { hello: 'world' }, 1000);
      jest.advanceTimersByTime(1001);
      expect(model.getCachedContent('home')).toBeNull();
    });

    test('returns null for unknown keys', () => {
      expect(model.getCachedContent('missing')).toBeNull();
    });
  });

  describe('searchContent', () => {
    const items = [
      { title: 'DetectIt', tags: ['C++', 'YOLOv8'] },
      { title: 'ROS Tool', tags: ['Bash'] },
    ];

    test('filters by query across searchable fields', () => {
      const out = model.searchContent(items, 'detectit');
      expect(out).toHaveLength(1);
      expect(out[0].title).toBe('DetectIt');
    });

    test('requires every search term to match', () => {
      const out = model.searchContent(items, 'yolov8 bash');
      expect(out).toHaveLength(0);
    });

    test('applies array-value filters', () => {
      const out = model.searchContent(items, '', { tags: 'Bash' });
      expect(out).toHaveLength(1);
      expect(out[0].title).toBe('ROS Tool');
    });

    test('returns [] for non-array input', () => {
      expect(model.searchContent(null)).toEqual([]);
    });
  });
});

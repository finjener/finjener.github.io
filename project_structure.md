# React Portfolio - Complete Technical Project Structure

A comprehensive technical analysis of the React portfolio website architecture.

---

## Quick Stats

| Metric | Value |
|--------|-------|
| **Framework** | React 18.2.0 + CRA (rewired) |
| **Styling** | TailwindCSS 3.4.0 |
| **Routing** | react-router-dom 6.18.0 (HashRouter) |
| **Animation** | framer-motion 10.16.4 |
| **Total Source Files** | ~50 |
| **Total Lines of Code** | ~5,500 |
| **Architecture Pattern** | MVC (Model-View-Controller) |

---

## Complete Directory Tree

```
project-root/
│
├── .env                          # Environment config (5 vars)
├── .gitignore                    # Git ignore rules
├── .npmrc                        # NPM configuration
├── LICENSE                       # License file
├── config-overrides.js           # Webpack customization (54 lines)
├── package.json                  # Dependencies (66 lines)
├── package-lock.json             # Lock file (871KB)
├── tailwind.config.js            # TailwindCSS config (298 lines)
│
├── public/
│   ├── index.html                # SPA entry (50 lines)
│   ├── 404.html                  # GH Pages fallback
│   ├── manifest.json             # PWA manifest
│   ├── background-music.mp3      # Audio (7.2MB)
│   └── images/projects/          # 4 project thumbnails
│
├── build/                        # Production output
│
└── src/
    ├── App.js                    # Root component (79 lines)
    ├── index.js                  # Entry point (11 lines)
    ├── index.css                 # Global styles (417 lines)
    ├── setupProxy.js             # Dev proxy (12 lines)
    │
    ├── assets/                   # 6 PNG icons for PDF
    ├── components/               # 7 reusable components
    ├── contexts/                 # 1 React context
    ├── controllers/              # 2 controllers
    ├── data/                     # Content layer
    ├── models/                   # 3 entities + 2 services
    ├── pages/                    # 6 route components
    ├── services/                 # 5 service files
    ├── styles/                   # 1 CSS file
    ├── translations/             # EN + RU (6 JSON files)
    └── views/                    # 6 view components
```

---

## Entry Points

### src/index.js (11 lines)
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createDOM(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
```

### src/App.js (79 lines)
```
Imports: React, HashRouter, Routes, Route
         MatrixBackground, Navbar, BackgroundMusic
         Home, About, Projects, Contact, ArticleListingPage, ArticleDetailPage
         ScrollToTop, ErrorBoundary, LanguageProvider

Structure:
└── LanguageProvider
    └── HashRouter
        ├── ScrollToTop
        ├── BackgroundMusic
        └── div.min-h-screen
            ├── MatrixBackground
            ├── div.scan-overlay
            ├── Navbar
            └── ErrorBoundary
                └── Routes (6 routes)
```

---

## Components Layer (7 files)

### BackgroundMusic.js (144 lines)
| Function | Lines | Description |
|----------|-------|-------------|
| `BackgroundMusic` | 8-142 | Main component |
| `handleCanPlay` | 21-25 | Audio ready event |
| `handleError` | 27-31 | Error handling |
| `handleInteraction` | 56-62 | User interaction detection |
| `toggleMute` | 98-103 | Mute toggle |
| `getAudioUrl` | 105-109 | URL builder |

**State**: `isMuted`, `isLoaded`, `error`, `hasInteracted`
**Ref**: `audioRef`

---

### ErrorBoundary.js (87 lines)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 17-28 | Initialize state |
| `getDerivedStateFromError` | 30-40 | Static error handler |
| `componentDidCatch` | 42-51 | Error logging |
| `render` | 53-84 | Fallback UI |

**State**: `hasError`, `error`

---

### LanguageSelector.js (304 lines)
| Function | Lines | Description |
|----------|-------|-------------|
| `LanguageSelector` | 12-302 | Main component |
| `handleClickOutside` | 26-30 | Outside click detection |
| `handleEscape` | 43-48 | ESC key handler |
| `handleLanguageChange` | 56-66 | Language selection |
| `handleKeyDown` | 68-79 | Keyboard navigation |
| `getVariantStyles` | 118-140 | Style variants |

**Props**: `className`, `variant`
**State**: `isOpen`

---

### MarkdownContent.js (253 lines)
| Component | Lines | Description |
|-----------|-------|-------------|
| `MarkdownContent` | 35-251 | Memoized wrapper |
| `code` | 64-95 | Syntax highlighting |
| `h1-h4` | 97-125 | Heading renderers |
| `p` | 127-132 | Paragraph |
| `ul/ol/li` | 134-149 | Lists |
| `a` | 151-192 | Links with routing |
| `blockquote` | 194-199 | Quotes |
| `hr` | 200-202 | Horizontal rule |
| `img` | 204-219 | Images with caption |
| `table/thead/th/td` | 221-243 | Tables |

**Dependencies**: ReactMarkdown, remarkGfm, rehypeRaw, rehypeSanitize, Prism

---

### MatrixBackground.js (292 lines)
| Function/Class | Lines | Description |
|----------------|-------|-------------|
| `MatrixBackground` | 13-290 | Main component |
| `checkMobile` | 27-29 | Mobile detection |
| `sketch` | 38-267 | p5.js sketch |
| `Stream` (class) | 57-178 | Character stream |
| `Stream.constructor` | 58-74 | Initialize stream |
| `Stream.generateChars` | 76-90 | Random characters |
| `Stream.render` | 92-177 | Draw stream |
| `setup` | 180-202 | p5 setup |
| `draw` | 204-237 | Animation loop |
| `windowResized` | 239-257 | Resize handler |

**State**: `isMobile`
**Refs**: `containerRef`, `p5InstanceRef`

---

### Navbar.js (280 lines)
| Function | Lines | Description |
|----------|-------|-------------|
| `Navbar` | 16-278 | Main component |
| `handleScroll` | 31-34 | Scroll detection |
| `isActiveRoute` | 58-69 | Route matching |

**State**: `isScrolled`, `isMobileMenuOpen`

---

### ScrollToTop.js (14 lines)
```javascript
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};
```

---

## Pages Layer (6 files)

| Page | Lines | Sub-components | Key Functions |
|------|-------|----------------|---------------|
| **Home.js** | 336 | - | `loadContent` |
| **About.js** | 23 | - | Delegates to `AboutView` |
| **Projects.js** | 301 | `ProjectCard` | `loadContent`, PropTypes |
| **Contact.js** | 162 | - | `loadContent`, `handleSubmit`, `handleChange` |
| **ArticleListingPage.js** | 198 | `ArticleCard` (memo) | `loadContent` |
| **ArticleDetailPage.js** | 183 | - | `fetchContent` |

---

## Views Layer (7 files)

### views/index.js (Barrel Export)
```javascript
export { default as AboutView } from './pages/AboutView.js';
export { default as EducationSection } from './components/EducationSection.js';
export { default as SkillsSection } from './components/SkillsSection.js';
export { default as ExperienceSection } from './components/ExperienceSection.js';
export { default as ProfessionalOverview } from './components/ProfessionalOverview.js';
export { default as AdditionalSections } from './components/AdditionalSections.js';
```

### View Components

| Component | Lines | Sub-components |
|-----------|-------|----------------|
| **AboutView** | 182 | Uses all section components |
| **EducationSection** | 104 | `EducationItem` |
| **ExperienceSection** | 166 | `ExperienceItem` |
| **SkillsSection** | 99 | `SkillCategory` |
| **ProfessionalOverview** | 88 | - |
| **AdditionalSections** | 276 | `SectionCard`, `HobbiesSection`, `CertificationsSection`, `PublicationsSection`, `LanguagesSection`, `AwardsSection`, `VolunteeringSection` |

---

## Models Layer (5 files)

### models/index.js (Barrel Export)
```javascript
export { ContentModel, contentModel } from './entities/ContentModel.js';
export { ProjectModel, projectModel } from './entities/ProjectModel.js';
export { ArticleModel, articleModel } from './entities/ArticleModel.js';
export { ArticleSearchService, articleSearchService } from './services/ArticleSearchService.js';
export { ArticleContentProcessor, articleContentProcessor } from './services/ArticleContentProcessor.js';
```

### ContentModel.js (335 lines, 17 methods)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 15-18 | Initialize cache |
| `validateContent` | 20-59 | Content validation |
| `transformContentForDisplay` | 61-81 | UI transformation |
| `cacheContent` | 83-98 | Cache with TTL |
| `getCachedContent` | 100-117 | Cache retrieval |
| `searchContent` | 119-151 | Content search |
| `_initializeValidationRules` | 155-204 | Validation rules |
| `_transformHomeContent` | 206-220 | Home transform |
| `_transformAboutContent` | 222-233 | About transform |
| `_transformProjectsContent` | 235-251 | Projects transform |
| `_transformArticlesContent` | 253-269 | Articles transform |
| `_transformContactContent` | 271-281 | Contact transform |
| `_extractSearchableText` | 283-298 | Search extraction |
| `_matchesFilter` | 300-313 | Filter matching |
| `_generateContentHash` | 315-329 | Content hashing |

**Export**: Singleton `contentModel`

---

### ArticleModel.js (254 lines, 14 methods)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 18-23 | Initialize services |
| `validateArticle` | 25-75 | Article validation |
| `processArticleContent` | 77-86 | Delegate to processor |
| `searchArticles` | 88-98 | Delegate to search |
| `sortArticles` | 100-110 | Sort delegation |
| `getArticleStatistics` | 112-120 | Statistics |
| `transformContent` | 122-131 | Format transform |
| `cacheArticle` | 133-144 | Article caching |
| `getCachedArticle` | 146-164 | Cache retrieval |
| `clearCache` | 166-172 | Clear cache |
| `validateAndProcessArticle` | 174-217 | Combined operation |
| `getSearchSuggestions` | 219-228 | Search suggestions |
| `_isValidSlug` | 230-234 | Slug validation |
| `_isValidDate` | 236-239 | Date validation |
| `_isValidReadTime` | 241-244 | Read time validation |
| `_isValidContentPath` | 246-249 | Path validation |

**Dependencies**: `articleSearchService`, `articleContentProcessor`

---

### ProjectModel.js (418 lines, 18 methods)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 15-19 | Initialize maps |
| `validateProject` | 21-67 | Project validation |
| `categorizeProjects` | 69-124 | Category grouping |
| `filterProjects` | 126-180 | Multi-criteria filter |
| `sortProjects` | 182-221 | Sort with comparators |
| `getProjectStatistics` | 223-300 | Comprehensive stats |
| `_isValidYearFormat` | 304-313 | Year validation |
| `_isValidTeamSize` | 315-324 | Team size validation |
| `_isValidDescription` | 326-334 | Description validation |
| `_extractYearFromProject` | 336-346 | Year extraction |
| `_getProjectSearchableText` | 348-364 | Search text |
| `_extractTeamSize` | 366-376 | Team size extraction |
| `_calculateProjectDuration` | 378-394 | Duration calculation |
| `_getEmptyStatistics` | 396-412 | Empty stats object |

---

### ArticleSearchService.js (407 lines, 17 methods)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 15-24 | Initialize fields |
| `searchArticles` | 26-47 | Main search |
| `sortArticles` | 49-62 | Sorting |
| `getArticleStatistics` | 64-139 | Statistics |
| `getSuggestedSearchTerms` | 141-181 | Suggestions |
| `_applyFilters` | 183-234 | Filter application |
| `_applySearchQuery` | 236-253 | Query application |
| `_calculateSearchScore` | 255-304 | Score calculation |
| `_getCompareFunction` | 306-343 | Comparator factory |
| `_extractTerms` | 345-358 | Term extraction |
| `_isExactWordMatch` | 360-370 | Word matching |
| `_extractReadTimeMinutes` | 372-382 | Time extraction |
| `_getEmptyStatistics` | 384-402 | Empty stats |

---

### ArticleContentProcessor.js (501 lines, 20 methods)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 15-20 | Initialize formats |
| `processArticleContent` | 22-68 | Main processor |
| `validateArticleContent` | 70-118 | Validation |
| `transformContent` | 120-147 | Format transform |
| `_extractFrontmatter` | 149-174 | Frontmatter parsing |
| `_parseSimpleYaml` | 176-219 | YAML parser |
| `_calculateReadTime` | 221-231 | Read time calc |
| `_countWords` | 233-245 | Word counting |
| `_extractExcerpt` | 247-272 | Excerpt extraction |
| `_generateTableOfContents` | 274-299 | TOC generation |
| `_generateSlug` | 301-314 | Slug generation |
| `_extractImages` | 316-336 | Image extraction |
| `_extractCodeBlocks` | 338-357 | Code extraction |
| `_stripMarkdown` | 359-379 | MD stripping |
| `_convertToHtml` | 381-399 | HTML conversion |
| `_generateTocHtml` | 401-415 | TOC HTML |
| `_generateExcerpt` | 417-438 | Excerpt options |
| `_validateMetadata` | 440-474 | Metadata validation |
| `_isValidDate` | 476-485 | Date validation |
| `_isValidReadTime` | 487-496 | Time validation |

---

## Controllers Layer (3 files)

### controllers/index.js (Barrel Export)
```javascript
export { ContentController, contentController } from './coordinators/ContentController.js';
export { NavigationController, navigationController } from './coordinators/NavigationController.js';
```

### ContentController.js (349 lines, 13 methods)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 19-25 | Initialize state |
| `loadContent` | 27-106 | Content loading with retry |
| `getContentSection` | 108-130 | Section retrieval |
| `searchContent` | 132-175 | Cross-content search |
| `refreshContent` | 177-185 | Content refresh |
| `subscribeToContent` | 187-203 | Subscribe to updates |
| `unsubscribeFromContent` | 205-212 | Unsubscribe |
| `getLoadingState` | 214-223 | Loading state |
| `getErrorState` | 225-234 | Error state |
| `_loadFromContentful` | 238-249 | CMS loading |
| `_loadFromLocal` | 251-262 | Local loading |
| `_validateAndTransformContent` | 264-290 | Validation |
| `_setLoadingState` | 292-299 | State management |
| `_setError` | 301-308 | Error management |
| `_clearError` | 310-317 | Clear errors |
| `_notifySubscribers` | 319-334 | Notify subscribers |
| `_delay` | 336-343 | Retry delay |

---

### NavigationController.js (449 lines, 22 methods)
| Method | Lines | Description |
|--------|-------|-------------|
| `constructor` | 15-22 | Initialize state |
| `navigate` | 24-82 | Navigation with validation |
| `goBack` | 84-111 | History back |
| `canGoBack` | 113-121 | Check back capability |
| `getNavigationContext` | 123-131 | Get context |
| `setNavigationContext` | 133-144 | Set context |
| `getBreadcrumbs` | 146-153 | Get breadcrumbs |
| `addRouteListener` | 155-180 | Add listener |
| `removeRouteListener` | 182-189 | Remove listener |
| `getCurrentRoute` | 191-198 | Current route |
| `getNavigationHistory` | 200-209 | Get history |
| `clearNavigationHistory` | 211-217 | Clear history |
| `isCurrentRoute` | 219-234 | Route matching |
| `generateRouteUrl` | 236-259 | URL generation |
| `parseRoute` | 261-292 | Route parsing |
| `_isValidRoute` | 296-307 | Route validation |
| `_addToHistory` | 309-324 | Add to history |
| `_updateBreadcrumbs` | 326-356 | Update breadcrumbs |
| `_formatBreadcrumbLabel` | 358-369 | Format labels |
| `_notifyListeners` | 371-385 | Notify listeners |
| `_scrollToTop` | 400-408 | Scroll to top |
| `_generateHistoryId` | 420-430 | Generate ID |

---

## Services Layer (5 files)

### articleService.js (38 lines)
```javascript
export const loadArticleContent = async (contentPath) => {
  const module = await import(`!!raw-loader!../data/content/${contentPath}`);
  const { frontmatter, content } = extractFrontmatter(module.default);
  return { content, frontmatter };
};
```

---

### contentful.js (121 lines, 6 functions)
| Function | Lines | Description |
|----------|-------|-------------|
| `isContentfulConfigured` | 3-6 | Check env vars |
| `getContentfulContent` | 18-50 | Fetch from CMS |
| `transformContentfulData` | 52-101 | Transform entries |
| `transformAsset` | 53-57 | Asset transform |
| `transformField` | 59-79 | Field transform |
| `transformContentfulEntry` | 81-98 | Entry transform |
| `togglePreviewMode` | 103-114 | Toggle preview |
| `isPreviewMode` | 116-121 | Check preview |

**Exports**: `getContentfulContent`, `togglePreviewMode`, `isPreviewMode`

---

### markdown.js (80 lines, 2 functions)
| Function | Lines | Description |
|----------|-------|-------------|
| `loadMarkdownContent` | 5-22 | Load from URL |
| `extractFrontmatter` | 24-80 | Parse frontmatter |

---

### pdfGenerator.js (371 lines)
| Function | Lines | Description |
|----------|-------|-------------|
| `cleanMarkdown` | 11-34 | Strip MD formatting |
| `createBulletPoints` | 36-43 | Create bullets |
| `Sep` | 45-46 | Separator component |
| `ResumeDocument` | 48-364 | PDF document |
| `generateResumePDF` | 366-368 | Export function |

**Dependencies**: @react-pdf/renderer, custom icons

---

### pdfStyles.js (2,918 bytes)
StyleSheet definitions for PDF generation.

---

## Context Layer (1 file)

### LanguageContext.js (302 lines)
| Export | Type | Description |
|--------|------|-------------|
| `SUPPORTED_LANGUAGES` | Array | EN, RU configs |
| `useLanguage` | Hook | Context consumer |
| `LanguageProvider` | Component | Provider wrapper |

**Context Value**:
- `currentLanguage`, `supportedLanguages`, `translations`
- `loading`, `error`
- `changeLanguage`, `translate`, `t`
- `getCurrentLanguageInfo`, `formatDate`, `formatNumber`
- `isRTL`

---

## Data Layer (16 content files)

### data/index.js (160 lines)
| Function | Lines | Description |
|----------|-------|-------------|
| `loadLocalContent` | 18-36 | Load all JSON |
| `validateContent` | 39-120 | Validate structure |
| `transformContent` | 123-136 | Transform for use |
| `getContent` | 138-160 | Main export |

### Content Files (src/data/content/)

| File | Bytes | Structure |
|------|-------|-----------|
| `home.json` | 884 | `{ hero, highlights }` |
| `skills.json` | 1,356 | `{ categories[] }` |
| `experience.json` | 2,452 | `{ experiences[] }` |
| `projects.json` | 8,944 | `{ categories[].projects[] }` |
| `education.json` | 2,246 | `{ education[] }` |
| `articles.json` | 2,635 | `{ items[], categories[] }` |
| `certifications.json` | 1,662 | `{ certifications[] }` |
| `contact.json` | 1,449 | `{ form, socialLinks }` |
| `hobbies.json` | 1,319 | `{ categories[] }` |
| `languages.json` | 377 | Language list |
| `awards.json` | 714 | Awards data |
| `publications.json` | 748 | Publications |
| `volunteering.json` | 597 | Volunteer work |
| `overview.json` | 322 | Summary |
| `resumeContact.json` | 413 | Resume contact |

### Articles (Markdown)

| Article | Size |
|---------|------|
| `article-1.md` | 9KB |
| `article-2.md` | 11KB |
| `article-3.md` | 49KB |
| `article-4.md` | 12KB |

---

## Translations (6 files)

### Structure
```
translations/
├── en/
│   ├── common.json    (3,558 bytes)
│   ├── content.json   (4,356 bytes)
│   └── pages.json     (4,743 bytes)
└── ru/
    ├── common.json
    ├── content.json
    └── pages.json
```

---

## Configuration Files

### tailwind.config.js (298 lines)
- Custom breakpoint: `xs: 480px`, `3xl: 1920px`
- Custom colors: 12 `edex-*` theme colors
- Custom fonts: 4 font families
- Custom spacing: `18`, `88`, `128`
- Animations: 30+ keyframe definitions
- Background images: 5 custom patterns

### config-overrides.js (54 lines)
- raw-loader for `.md` files
- Source map warning suppression
- @mediapipe exclusion

### .env
```bash
GENERATE_SOURCEMAP=false
FAST_REFRESH=true
INLINE_RUNTIME_CHUNK=false
DISABLE_ESLINT_PLUGIN=false
```

---

## Dependencies Summary

### Production (25 packages)
| Package | Purpose |
|---------|---------|
| react, react-dom | Core framework |
| react-router-dom | Routing |
| tailwindcss | Styling |
| framer-motion | Animations |
| @react-pdf/renderer | PDF generation |
| contentful | CMS integration |
| react-markdown | MD rendering |
| prismjs, react-syntax-highlighter | Code highlighting |
| katex, rehype-katex, remark-math | Math equations |
| remark-gfm, rehype-raw | MD extensions |
| p5 | Canvas graphics |
| react-icons, @heroicons/react | Icons |
| ajv, ajv-keywords | JSON validation |

### Dev (3 packages)
| Package | Purpose |
|---------|---------|
| gh-pages | Deployment |
| raw-loader | MD file loading |
| react-app-rewired | Config override |

---

## File Sizes (Top 15)

| File | Size | Lines |
|------|------|-------|
| background-music.mp3 | 7.2MB | - |
| package-lock.json | 871KB | - |
| article-3.md | 49KB | - |
| pdfGenerator.js | 16KB | 371 |
| ArticleContentProcessor.js | 14KB | 501 |
| ProjectModel.js | 13KB | 418 |
| ArticleSearchService.js | 12KB | 407 |
| NavigationController.js | 12KB | 449 |
| Home.js | 12KB | 336 |
| Navbar.js | 12KB | 280 |
| ContentController.js | 11KB | 349 |
| tailwind.config.js | 11KB | 298 |
| LanguageSelector.js | 10KB | 304 |
| MatrixBackground.js | 10KB | 292 |
| index.css | 9KB | 417 |

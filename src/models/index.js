/**
 * @fileoverview Barrel export for Model entities
 * @author Portfolio Website
 * @created 2025
 */

export { ContentModel, contentModel } from './entities/ContentModel.js';
export { ProjectModel, projectModel } from './entities/ProjectModel.js';
export { ArticleModel, articleModel } from './entities/ArticleModel.js';

// Article Services
export { ArticleSearchService, articleSearchService } from './services/ArticleSearchService.js';
export { ArticleContentProcessor, articleContentProcessor } from './services/ArticleContentProcessor.js';

// Export all models as a single object for convenience
export const models = {
  content: contentModel,
  project: projectModel,
  article: articleModel
};

// Export all services as a single object for convenience
export const services = {
  articleSearch: articleSearchService,
  articleContentProcessor: articleContentProcessor
};

export default models;

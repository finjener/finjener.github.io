/**
 * @fileoverview Barrel export for Controller coordinators
 * @author Portfolio Website
 * @created 2025
 */

import { ContentController, contentController } from './coordinators/ContentController.js';
import { NavigationController, navigationController } from './coordinators/NavigationController.js';

// Re-export classes and instances
export { ContentController, contentController };
export { NavigationController, navigationController };

// Export all controllers as a single object for convenience
export const controllers = {
  content: contentController,
  navigation: navigationController
};

export default controllers;

/**
 * @fileoverview Navigation controller for managing routing and navigation flow
 * @author Portfolio Website
 * @created 2025
 * @layer Controller
 * @responsibilities Route management, navigation coordination, history tracking
 */

/**
 * @class NavigationController
 * @description Coordinates navigation flow and routing throughout the application
 * Provides centralized navigation management with history tracking and error handling
 */
export class NavigationController {
  constructor() {
    this.navigationHistory = [];
    this.currentRoute = null;
    this.routeListeners = new Map();
    this.breadcrumbs = [];
    this.navigationContext = new Map();
    this.maxHistorySize = 50;
  }

  /**
   * @method navigate
   * @description Navigates to a specific route with optional state
   * @param {string} route - Target route path
   * @param {Object} options - Navigation options (state, replace, etc.)
   * @returns {Promise<boolean>} Success status of navigation
   */
  async navigate(route, options = {}) {
    const {
      state = {},
      replace = false,
      smooth = false,
      scrollToTop = true,
      trackInHistory = true
    } = options;

    try {
      // Validate route
      if (!this._isValidRoute(route)) {
        throw new Error(`Invalid route: ${route}`);
      }

      // Store previous route for history
      const previousRoute = this.currentRoute;

      // Update current route
      this.currentRoute = {
        path: route,
        state,
        timestamp: Date.now(),
        previous: previousRoute?.path || null
      };

      // Add to navigation history if tracking is enabled
      if (trackInHistory && !replace) {
        this._addToHistory(this.currentRoute);
      }

      // Update breadcrumbs
      this._updateBreadcrumbs(route);

      // Store navigation context
      this._storeNavigationContext(route, state);

      // Notify route listeners
      this._notifyRouteListeners(this.currentRoute, previousRoute);

      // Handle scrolling
      if (scrollToTop) {
        this._scrollToTop(smooth);
      }

      return true;

    } catch (error) {
      console.error('Navigation failed:', error);
      return false;
    }
  }

  /**
   * @method goBack
   * @description Navigates back in history
   * @param {number} steps - Number of steps to go back (default: 1)
   * @returns {Promise<boolean>} Success status of navigation
   */
  async goBack(steps = 1) {
    if (this.navigationHistory.length === 0) {
      console.warn('No navigation history available');
      return false;
    }

    const targetIndex = Math.max(0, this.navigationHistory.length - steps - 1);
    const targetRoute = this.navigationHistory[targetIndex];

    if (targetRoute) {
      // Remove entries after target from history
      this.navigationHistory = this.navigationHistory.slice(0, targetIndex + 1);
      
      return this.navigate(targetRoute.path, {
        state: targetRoute.state,
        replace: true,
        trackInHistory: false
      });
    }

    return false;
  }

  /**
   * @method canGoBack
   * @description Checks if navigation can go back
   * @param {number} steps - Number of steps to check (default: 1)
   * @returns {boolean} Whether back navigation is possible
   */
  canGoBack(steps = 1) {
    return this.navigationHistory.length > steps;
  }

  /**
   * @method getNavigationContext
   * @description Gets stored navigation context for a route
   * @param {string} route - Route path
   * @returns {Object|null} Navigation context or null if not found
   */
  getNavigationContext(route) {
    return this.navigationContext.get(route) || null;
  }

  /**
   * @method setNavigationContext
   * @description Sets navigation context for a route
   * @param {string} route - Route path
   * @param {Object} context - Context data to store
   */
  setNavigationContext(route, context) {
    this.navigationContext.set(route, {
      ...context,
      timestamp: Date.now()
    });
  }

  /**
   * @method getBreadcrumbs
   * @description Gets current breadcrumb trail
   * @returns {Array} Array of breadcrumb objects
   */
  getBreadcrumbs() {
    return [...this.breadcrumbs];
  }

  /**
   * @method addRouteListener
   * @description Adds a listener for route changes
   * @param {string} listenerId - Unique identifier for the listener
   * @param {Function} callback - Callback function for route changes
   * @param {Object} options - Listener options
   */
  addRouteListener(listenerId, callback, options = {}) {
    const {
      routes = [], // Specific routes to listen to (empty = all routes)
      includeState = false,
      immediate = false
    } = options;

    this.routeListeners.set(listenerId, {
      callback,
      routes,
      includeState,
      immediate
    });

    // Call immediately with current route if requested
    if (immediate && this.currentRoute) {
      this._callRouteListener(listenerId, this.currentRoute, null);
    }
  }

  /**
   * @method removeRouteListener
   * @description Removes a route change listener
   * @param {string} listenerId - Unique identifier for the listener
   */
  removeRouteListener(listenerId) {
    this.routeListeners.delete(listenerId);
  }

  /**
   * @method getCurrentRoute
   * @description Gets the current route information
   * @returns {Object|null} Current route object or null
   */
  getCurrentRoute() {
    return this.currentRoute ? { ...this.currentRoute } : null;
  }

  /**
   * @method getNavigationHistory
   * @description Gets the navigation history
   * @param {number} limit - Maximum number of entries to return
   * @returns {Array} Array of route history entries
   */
  getNavigationHistory(limit = null) {
    const history = [...this.navigationHistory];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * @method clearNavigationHistory
   * @description Clears the navigation history
   */
  clearNavigationHistory() {
    this.navigationHistory = [];
  }

  /**
   * @method isCurrentRoute
   * @description Checks if a route is the current route
   * @param {string} route - Route path to check
   * @param {boolean} exact - Whether to match exactly (default: true)
   * @returns {boolean} Whether the route is current
   */
  isCurrentRoute(route, exact = true) {
    if (!this.currentRoute) return false;

    if (exact) {
      return this.currentRoute.path === route;
    } else {
      return this.currentRoute.path.startsWith(route);
    }
  }

  /**
   * @method generateRouteUrl
   * @description Generates a full URL for a route with parameters
   * @param {string} route - Base route path
   * @param {Object} params - Route parameters
   * @param {Object} query - Query parameters
   * @returns {string} Generated URL
   */
  generateRouteUrl(route, params = {}, query = {}) {
    let url = route;

    // Replace route parameters
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });

    // Add query parameters
    const queryString = new URLSearchParams(query).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * @method parseRoute
   * @description Parses a route path and extracts parameters
   * @param {string} route - Route path to parse
   * @returns {Object} Parsed route information
   */
  parseRoute(route) {
    const parts = route.split('?');
    const path = parts[0];
    const queryString = parts[1] || '';
    
    // Parse path segments
    const segments = path.split('/').filter(segment => segment.length > 0);
    
    // Parse query parameters
    const queryParams = {};
    if (queryString) {
      const params = new URLSearchParams(queryString);
      for (const [key, value] of params.entries()) {
        queryParams[key] = value;
      }
    }

    return {
      fullPath: route,
      path,
      segments,
      queryParams,
      isRoot: path === '/' || path === '',
      depth: segments.length
    };
  }

  // Private methods for internal operations

  /**
   * @method _isValidRoute
   * @private
   * @description Validates if a route path is valid
   */
  _isValidRoute(route) {
    if (!route || typeof route !== 'string') return false;
    
    // Check for valid route format
    const routePattern = /^\/[\w\-\/]*$/;
    return routePattern.test(route) || route === '/';
  }

  /**
   * @method _addToHistory
   * @private
   * @description Adds route to navigation history
   */
  _addToHistory(routeInfo) {
    this.navigationHistory.push({
      ...routeInfo,
      id: this._generateHistoryId()
    });

    // Limit history size
    if (this.navigationHistory.length > this.maxHistorySize) {
      this.navigationHistory = this.navigationHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * @method _updateBreadcrumbs
   * @private
   * @description Updates breadcrumb trail based on current route
   */
  _updateBreadcrumbs(route) {
    const segments = route.split('/').filter(segment => segment.length > 0);
    const breadcrumbs = [];

    // Always add home
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      isActive: route === '/'
    });

    // Add segments as breadcrumbs
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      breadcrumbs.push({
        label: this._formatBreadcrumbLabel(segment),
        path: currentPath,
        isActive: isLast
      });
    });

    this.breadcrumbs = breadcrumbs;
  }

  /**
   * @method _formatBreadcrumbLabel
   * @private
   * @description Formats segment name for breadcrumb display
   */
  _formatBreadcrumbLabel(segment) {
    // Convert kebab-case to Title Case
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * @method _storeNavigationContext
   * @private
   * @description Stores navigation context for a route
   */
  _storeNavigationContext(route, state) {
    if (Object.keys(state).length > 0) {
      this.setNavigationContext(route, state);
    }
  }

  /**
   * @method _notifyRouteListeners
   * @private
   * @description Notifies all route listeners of navigation changes
   */
  _notifyRouteListeners(currentRoute, previousRoute) {
    for (const [listenerId, listener] of this.routeListeners.entries()) {
      // Check if listener should be called for this route
      if (listener.routes.length > 0 && !listener.routes.includes(currentRoute.path)) {
        continue;
      }

      this._callRouteListener(listenerId, currentRoute, previousRoute);
    }
  }

  /**
   * @method _callRouteListener
   * @private
   * @description Calls a specific route listener
   */
  _callRouteListener(listenerId, currentRoute, previousRoute) {
    const listener = this.routeListeners.get(listenerId);
    if (!listener) return;

    try {
      const routeData = {
        path: currentRoute.path,
        previous: previousRoute?.path || null,
        timestamp: currentRoute.timestamp
      };

      if (listener.includeState) {
        routeData.state = currentRoute.state;
      }

      listener.callback(routeData);
    } catch (error) {
      console.error(`Error calling route listener ${listenerId}:`, error);
    }
  }

  /**
   * @method _scrollToTop
   * @private
   * @description Scrolls page to top
   */
  _scrollToTop(smooth = false) {
    if (typeof window !== 'undefined') {
      const behavior = smooth ? 'smooth' : 'auto';
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }

  /**
   * @method _generateHistoryId
   * @private
   * @description Generates unique ID for history entries
   */
  _generateHistoryId() {
    return `nav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const navigationController = new NavigationController();
export default navigationController;

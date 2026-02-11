/**
 * @fileoverview Project model for managing project data and business rules
 * @author Portfolio Website
 * @created 2025
 * @layer Model
 * @responsibilities Project data validation, filtering, categorization, and business rules
 */

/**
 * @class ProjectModel
 * @description Handles project-specific business logic and data operations
 * Provides methods for project filtering, sorting, and validation
 */
export class ProjectModel {
  constructor() {
    this.projectCategories = new Map();
    this.techStackMap = new Map();
    this.statusTypes = ['Completed', 'In Progress', 'Planned', 'On Hold'];
  }

  /**
   * @method validateProject
   * @description Validates project data structure and business rules
   * @param {Object} project - Project object to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateProject(project) {
    const errors = [];
    const requiredFields = ['title', 'description', 'tech', 'status'];

    // Check required fields
    requiredFields.forEach(field => {
      if (!project || !project[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate tech stack
    if (project.tech && !Array.isArray(project.tech)) {
      errors.push('Tech stack must be an array');
    }

    // Validate status
    if (project.status && !this.statusTypes.includes(project.status)) {
      errors.push(`Invalid status: ${project.status}. Must be one of: ${this.statusTypes.join(', ')}`);
    }

    // Validate year format
    if (project.year && !this._isValidYearFormat(project.year)) {
      errors.push('Year must be in format "YYYY" or "YYYY - YYYY"');
    }

    // Validate team size
    if (project.teamSize && !this._isValidTeamSize(project.teamSize)) {
      errors.push('Team size must be in format "X member" or "X members"');
    }

    // Validate description format
    if (project.description && !this._isValidDescription(project.description)) {
      errors.push('Description must be a string or array of strings');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * @method categorizeProjects
   * @description Organizes projects by categories with metadata
   * @param {Array} projects - Array of project objects
   * @returns {Object} Categorized projects with metadata
   */
  categorizeProjects(projects) {
    if (!Array.isArray(projects)) return {};

    const categories = {};
    
    projects.forEach(project => {
      const category = project.category || 'Other';
      
      if (!categories[category]) {
        categories[category] = {
          name: category,
          projects: [],
          totalProjects: 0,
          techStackCount: new Map(),
          statusDistribution: new Map(),
          yearRange: { earliest: null, latest: null }
        };
      }

      categories[category].projects.push(project);
      categories[category].totalProjects++;

      // Update tech stack count
      if (project.tech) {
        project.tech.forEach(tech => {
          const current = categories[category].techStackCount.get(tech) || 0;
          categories[category].techStackCount.set(tech, current + 1);
        });
      }

      // Update status distribution
      if (project.status) {
        const current = categories[category].statusDistribution.get(project.status) || 0;
        categories[category].statusDistribution.set(project.status, current + 1);
      }

      // Update year range
      const projectYear = this._extractYearFromProject(project);
      if (projectYear) {
        if (!categories[category].yearRange.earliest || projectYear < categories[category].yearRange.earliest) {
          categories[category].yearRange.earliest = projectYear;
        }
        if (!categories[category].yearRange.latest || projectYear > categories[category].yearRange.latest) {
          categories[category].yearRange.latest = projectYear;
        }
      }
    });

    return categories;
  }

  /**
   * @method filterProjects
   * @description Filters projects based on multiple criteria
   * @param {Array} projects - Array of project objects
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered projects array
   */
  filterProjects(projects, filters = {}) {
    if (!Array.isArray(projects)) return [];

    let filtered = [...projects];

    // Filter by technology
    if (filters.tech) {
      filtered = filtered.filter(project => 
        project.tech && project.tech.includes(filters.tech)
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Filter by year range
    if (filters.yearFrom || filters.yearTo) {
      filtered = filtered.filter(project => {
        const projectYear = this._extractYearFromProject(project);
        if (!projectYear) return false;
        
        if (filters.yearFrom && projectYear < filters.yearFrom) return false;
        if (filters.yearTo && projectYear > filters.yearTo) return false;
        
        return true;
      });
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(project => 
        project.category === filters.category
      );
    }

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(project => {
        const searchableText = this._getProjectSearchableText(project).toLowerCase();
        return searchableText.includes(query);
      });
    }

    return filtered;
  }

  /**
   * @method sortProjects
   * @description Sorts projects based on specified criteria
   * @param {Array} projects - Array of project objects
   * @param {string} sortBy - Sort criteria ('date', 'title', 'status', 'tech')
   * @param {string} order - Sort order ('asc' or 'desc')
   * @returns {Array} Sorted projects array
   */
  sortProjects(projects, sortBy = 'date', order = 'desc') {
    if (!Array.isArray(projects)) return [];

    const sorted = [...projects];

    const compareFunctions = {
      date: (a, b) => {
        const yearA = this._extractYearFromProject(a) || 0;
        const yearB = this._extractYearFromProject(b) || 0;
        return order === 'asc' ? yearA - yearB : yearB - yearA;
      },
      title: (a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return order === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      },
      status: (a, b) => {
        const statusOrder = { 'In Progress': 0, 'Completed': 1, 'Planned': 2, 'On Hold': 3 };
        const statusA = statusOrder[a.status] ?? 99;
        const statusB = statusOrder[b.status] ?? 99;
        return order === 'asc' ? statusA - statusB : statusB - statusA;
      },
      tech: (a, b) => {
        const techCountA = a.tech ? a.tech.length : 0;
        const techCountB = b.tech ? b.tech.length : 0;
        return order === 'asc' ? techCountA - techCountB : techCountB - techCountA;
      }
    };

    const compareFunction = compareFunctions[sortBy] || compareFunctions.date;
    return sorted.sort(compareFunction);
  }

  /**
   * @method getProjectStatistics
   * @description Calculates comprehensive project statistics
   * @param {Array} projects - Array of project objects
   * @returns {Object} Project statistics object
   */
  getProjectStatistics(projects) {
    if (!Array.isArray(projects)) return this._getEmptyStatistics();

    const stats = {
      totalProjects: projects.length,
      statusDistribution: new Map(),
      techFrequency: new Map(),
      yearDistribution: new Map(),
      teamSizeAnalysis: {
        solo: 0,
        small: 0, // 2-5 members
        medium: 0, // 6-10 members
        large: 0 // 10+ members
      },
      averageProjectDuration: 0,
      projectsWithLinks: 0,
      projectsWithHighlights: 0
    };

    let totalDuration = 0;
    let projectsWithDuration = 0;

    projects.forEach(project => {
      // Status distribution
      if (project.status) {
        const statusCount = stats.statusDistribution.get(project.status) || 0;
        stats.statusDistribution.set(project.status, statusCount + 1);
      }

      // Technology frequency
      if (project.tech) {
        project.tech.forEach(tech => {
          const techCount = stats.techFrequency.get(tech) || 0;
          stats.techFrequency.set(tech, techCount + 1);
        });
      }

      // Year distribution
      const projectYear = this._extractYearFromProject(project);
      if (projectYear) {
        const yearCount = stats.yearDistribution.get(projectYear) || 0;
        stats.yearDistribution.set(projectYear, yearCount + 1);
      }

      // Team size analysis
      const teamSize = this._extractTeamSize(project.teamSize);
      if (teamSize !== null) {
        if (teamSize === 1) stats.teamSizeAnalysis.solo++;
        else if (teamSize <= 5) stats.teamSizeAnalysis.small++;
        else if (teamSize <= 10) stats.teamSizeAnalysis.medium++;
        else stats.teamSizeAnalysis.large++;
      }

      // Project duration
      const duration = this._calculateProjectDuration(project);
      if (duration > 0) {
        totalDuration += duration;
        projectsWithDuration++;
      }

      // Links and highlights
      if (project.link || project.github) stats.projectsWithLinks++;
      if (project.highlights && project.highlights.length > 0) stats.projectsWithHighlights++;
    });

    // Calculate averages
    if (projectsWithDuration > 0) {
      stats.averageProjectDuration = totalDuration / projectsWithDuration;
    }

    return stats;
  }

  // Private helper methods

  /**
   * @method _isValidYearFormat
   * @private
   * @description Validates year format (YYYY or YYYY - YYYY)
   */
  _isValidYearFormat(year) {
    if (!year) return false;
    const yearPattern = /^\d{4}(\s*-\s*\d{4})?$/;
    return yearPattern.test(year);
  }

  /**
   * @method _isValidTeamSize
   * @private
   * @description Validates team size format
   */
  _isValidTeamSize(teamSize) {
    if (!teamSize) return true; // Optional field
    const teamSizePattern = /^\d+\s+members?$/i;
    return teamSizePattern.test(teamSize);
  }

  /**
   * @method _isValidDescription
   * @private
   * @description Validates description format
   */
  _isValidDescription(description) {
    return typeof description === 'string' || 
           (Array.isArray(description) && description.every(item => typeof item === 'string'));
  }

  /**
   * @method _extractYearFromProject
   * @private
   * @description Extracts numeric year from project year field
   */
  _extractYearFromProject(project) {
    if (!project.year) return null;
    
    const yearMatch = project.year.match(/\d{4}/);
    return yearMatch ? parseInt(yearMatch[0], 10) : null;
  }

  /**
   * @method _getProjectSearchableText
   * @private
   * @description Gets searchable text from project
   */
  _getProjectSearchableText(project) {
    const searchableFields = [
      project.title,
      Array.isArray(project.description) ? project.description.join(' ') : project.description,
      project.tech ? project.tech.join(' ') : '',
      project.category,
      project.status,
      project.highlights ? project.highlights.join(' ') : ''
    ];

    return searchableFields.filter(Boolean).join(' ');
  }

  /**
   * @method _extractTeamSize
   * @private
   * @description Extracts numeric team size from team size string
   */
  _extractTeamSize(teamSize) {
    if (!teamSize) return null;
    
    const sizeMatch = teamSize.match(/(\d+)/);
    return sizeMatch ? parseInt(sizeMatch[1], 10) : null;
  }

  /**
   * @method _calculateProjectDuration
   * @private
   * @description Calculates project duration in months
   */
  _calculateProjectDuration(project) {
    if (!project.year) return 0;
    
    const yearRange = project.year.match(/(\d{4})\s*-\s*(\d{4})/);
    if (yearRange) {
      const startYear = parseInt(yearRange[1], 10);
      const endYear = parseInt(yearRange[2], 10);
      return (endYear - startYear + 1) * 12; // Rough estimate in months
    }
    
    return 12; // Assume 1 year for single year projects
  }

  /**
   * @method _getEmptyStatistics
   * @private
   * @description Returns empty statistics object
   */
  _getEmptyStatistics() {
    return {
      totalProjects: 0,
      statusDistribution: new Map(),
      techFrequency: new Map(),
      yearDistribution: new Map(),
      teamSizeAnalysis: { solo: 0, small: 0, medium: 0, large: 0 },
      averageProjectDuration: 0,
      projectsWithLinks: 0,
      projectsWithHighlights: 0
    };
  }
}

// Export singleton instance
export const projectModel = new ProjectModel();
export default projectModel;

import overview from './content/overview.json';
import education from './content/education.json';
import experience from './content/experience.json';
import hobbies from './content/hobbies.json';
import skills from './content/skills.json';
import certifications from './content/certifications.json';
import publications from './content/publications.json';
import languages from './content/languages.json';
import awards from './content/awards.json';
import volunteering from './content/volunteering.json';
import projects from './content/projects.json';
import home from './content/home.json';
import contact from './content/contact.json';
import articles from './content/articles.json';
import resumeContact from './content/resumeContact.json';

export const loadLocalContent = () => {
  return {
    overview,
    education,
    experience,
    hobbies,
    skills,
    certifications,
    publications,
    languages,
    awards,
    volunteering,
    projects,
    home,
    contact,
    articles,
    resumeContact
  };
};

// Optional: Add content validation
const validateContent = (content) => {
  // Basic validation example
  const requiredSections = [
    'education', 'experience', 'skills'
  ];

  const missingFields = requiredSections.filter(
    section => !content[section]
  );

  if (missingFields.length > 0) {
    // console.warn('Missing required content sections:', missingFields);
    throw new Error('Missing required content sections: ' + missingFields.join(', '));
  }

  // Optional sections that should be initialized if missing
  const optionalSections = [
    'overview', 'hobbies', 'certifications', 'publications',
    'languages', 'awards', 'volunteering',
    'home', 'contact', 'resumeContact'
  ];

  // Initialize optional sections with default structure
  optionalSections.forEach(section => {
    if (!content[section]) {
      // console.warn(`Initializing missing optional section: ${section}`);
      content[section] = {
        title: section.charAt(0).toUpperCase() + section.slice(1),
        items: [],
      };
    }
  });

  // Special handling for projects section
  if (!content.projects) {
    content.projects = {
      title: 'Projects',
      description: '',
      items: []
    };
  } else if (content.projects.categories) {
    // Transform categorized projects into flat list
    content.projects = {
      title: content.projects.title || 'Projects',
      description: content.projects.description || '',
      items: content.projects.categories.reduce((allProjects, category) => {
        return allProjects.concat(category.projects.map(project => ({
          ...project,
          category: category.name
        })));
      }, [])
    };
  } else if (!content.projects.items && Array.isArray(content.projects)) {
    content.projects = {
      title: 'Projects',
      description: '',
      items: content.projects
    };
  }

  // Special handling for leadership section
  if (!content.leadership) {
    content.leadership = [];
  } else if (!Array.isArray(content.leadership)) {
    content.leadership = content.leadership.items || [];
  }

  // Special handling for education coursework
  if (content.education && !content.education.coursework) {
    content.education.coursework = [];
  }

  // Ensure articles has the correct structure
  content.articles = {
    title: content.articles?.title || 'Articles',
    description: content.articles?.description || 'Technical writings and blog posts',
    items: Array.isArray(content.articles?.items) ? content.articles.items : [],
    categories: Array.isArray(content.articles?.categories) ? content.articles.categories : ['All']
  };

  return content;
};

// Optional: Add content transformation
const transformContent = (content) => {
  // Ensure backward compatibility between about and overview
  if (content.overview && !content.about) {
    content.about = content.overview;
  } else if (content.about && !content.overview) {
    content.overview = content.about;
  }

  return {
    ...content,
    lastUpdated: new Date().toISOString(),
    isLocal: !content.fromCMS
  };
};

export const getContent = async (isPreview = false) => {
  try {
    // Always use local content in development if Contentful is not configured
    if ((process.env.NODE_ENV === 'development' &&
      !process.env.REACT_APP_CONTENTFUL_SPACE_ID) || !isPreview) {
      // console.log('Using local content');
      const localContent = loadLocalContent();
      const validLocalContent = validateContent(localContent);
      return transformContent(validLocalContent);
    }

    // Try to get content from Contentful (lazy: SDK only loads on demand)
    const { getContentfulContent } = await import('../services/contentful');
    const cmsContent = await getContentfulContent();
    const validCmsContent = validateContent(cmsContent);
    return transformContent({ ...validCmsContent, fromCMS: true });
  } catch (error) {
    // console.warn('Falling back to local content:', error);
    // Fallback to local content
    const localContent = loadLocalContent();
    const validLocalContent = validateContent(localContent);
    return transformContent(validLocalContent);
  }
}; 
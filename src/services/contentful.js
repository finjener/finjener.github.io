import { createClient } from 'contentful';

const isContentfulConfigured = () => {
  return process.env.REACT_APP_CONTENTFUL_SPACE_ID && 
         process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN;
};

let client = null;

if (isContentfulConfigured()) {
  client = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || 'master'
  });
}

export const getContentfulContent = async () => {
  if (!isContentfulConfigured()) {
    // console.warn('Contentful is not configured. Using local content.');
    throw new Error('Contentful not configured');
  }

  try {
    const contentTypes = [
      'about', 'education', 'experience', 'skills', 
      'hobbies', 'certifications', 'publications',
      'languages', 'awards', 'volunteering', 'home', 
      'contact', 'articles'
    ];

    const contentPromises = contentTypes.map(type => 
      client.getEntries({ 
        content_type: type,
        include: 2,
        order: 'fields.order'
      })
    );

    const contentResponses = await Promise.all(contentPromises);
    
    return contentTypes.reduce((acc, type, index) => ({
      ...acc,
      [type]: transformContentfulData(contentResponses[index])
    }), {});
  } catch (error) {
    // console.error('Error fetching content from Contentful:', error);
    throw error;
  }
};

const transformContentfulData = (entries) => {
  const transformAsset = (asset) => ({
    url: asset?.fields?.file?.url,
    title: asset?.fields?.title,
    description: asset?.fields?.description
  });

  const transformField = (field) => {
    if (!field) return field;
    
    if (Array.isArray(field)) {
      return field.map(item => transformField(item));
    }

    if (field.sys?.type === 'Asset') {
      return transformAsset(field);
    }

    if (field.sys?.type === 'Entry') {
      return transformContentfulEntry(field);
    }

    if (typeof field === 'object' && field.fields) {
      return transformContentfulEntry(field);
    }

    return field;
  };

  const transformContentfulEntry = (entry) => {
    if (!entry.fields) return entry;

    const transformedFields = Object.entries(entry.fields).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: transformField(value)
      }),
      {}
    );

    return {
      ...transformedFields,
      id: entry.sys.id,
      contentType: entry.sys.contentType.sys.id,
      updatedAt: entry.sys.updatedAt
    };
  };

  return entries.items.map(transformContentfulEntry);
};

export const togglePreviewMode = (enabled) => {
  if (!isContentfulConfigured()) {
    // console.warn('Contentful is not configured. Preview mode not available.');
    return;
  }

  if (enabled) {
    localStorage.setItem('previewMode', 'true');
  } else {
    localStorage.removeItem('previewMode');
  }
};

export const isPreviewMode = () => {
  if (!isContentfulConfigured()) {
    return false;
  }
  return localStorage.getItem('previewMode') === 'true';
}; 
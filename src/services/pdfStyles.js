import { StyleSheet } from '@react-pdf/renderer';

// Create styles for Compact Classic/Academic Resume
export const styles = StyleSheet.create({
  page: {
    padding: 24, // Tighter margins (0.33in)
    fontFamily: 'Times-Roman',
    fontSize: 10, // Increased from 9
    lineHeight: 1.15,
    color: '#000000',
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerName: {
    fontSize: 22, // Increased from 20
    fontFamily: 'Times-Roman',
    marginBottom: 3,
    textTransform: 'none',
  },
  headerContactConfig: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9.5, // Increased from 8.5
  },
  link: {
    color: '#000000',
    textDecoration: 'none',
  },

  // Section Structure
  section: {
    marginBottom: 6, // Reduced spacing
  },
  sectionTitle: {
    fontSize: 11, // Increased from 10
    fontFamily: 'Times-Roman',
    textAlign: 'center',
    textTransform: 'uppercase', // Match typical academic headers
    borderBottomWidth: 0.5, // Thinner line
    borderBottomColor: '#000000',
    marginBottom: 3,
    paddingBottom: 1,
    marginHorizontal: 0,
  },

  // Content Rows
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap', // Allow wrapping for long titles
  },
  rightColumn: {
    alignItems: 'flex-end',
    minWidth: 60,
    marginLeft: 8,
  },

  // Text Styles
  bold: {
    fontFamily: 'Times-Bold',
  },
  italic: {
    fontFamily: 'Times-Italic',
  },
  regular: {
    fontFamily: 'Times-Roman',
  },

  // Experience/Job specific
  jobTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10, // Increased from 9
  },
  companyName: {
    fontFamily: 'Times-Bold',
    fontSize: 10, // Increased from 9
  },
  location: {
    fontFamily: 'Times-Roman',
    fontSize: 10, // Increased from 9
  },
  date: {
    fontFamily: 'Times-Roman',
    fontSize: 10, // Increased from 9
  },

  // Lists
  bulletPoint: {
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 0.5,
  },
  bulletChar: {
    width: 8,
    fontSize: 10, // Increased from 9
    color: '#444444', // Faded bullet
  },
  bulletContent: {
    flex: 1,
    fontSize: 10, // Increased from 9
    textAlign: 'justify',
    color: '#444444', // Faded explanation text
  },

  // Helper for faded text
  faded: {
    color: '#444444',
  },

  // Projects specific
  projectTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10, // Increased from 9
  },
  techStack: {
    fontFamily: 'Times-Italic',
    fontSize: 10, // Increased from 9
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  projectDescription: {
    flex: 1,
    marginLeft: 4,
  },

  // Skills
  skillCategory: {
    fontFamily: 'Times-Bold',
    fontSize: 10, // Increased from 9
  },
  skillList: {
    fontFamily: 'Times-Roman',
    fontSize: 10, // Increased from 9
  }
});

export default styles;
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { Project } from '@/app/types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  title: {
    fontSize: 14,
    color: '#333333',
  },
  linkWrapper: {
    marginTop: 4,
  },
  link: {
    color: '#000000',
    textDecoration: 'underline',
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    textTransform: 'uppercase',
    color: '#000000',
  },
  projectContainer: {
    marginBottom: 15,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  projectYear: {
    fontSize: 12,
    color: '#000000',
  },
  projectType: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 4,
    color: '#333333',
  },
  projectDescription: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 6,
    color: '#000000',
  },
  projectTech: {
    fontSize: 10,
    color: '#555555',
  }
});

export const PortfolioPDF = ({ projects }: { projects: Project[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>Firtiansyah Okta Resama</Text>
        <Text style={styles.title}>Project Portfolio</Text>
        <View style={styles.linkWrapper}>
          <Link src="https://hi.oktaa.my.id" style={styles.link}>
            https://hi.oktaa.my.id
          </Link>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Selected Projects</Text>

      {projects.map((project, index) => (
        <View key={project.id || index} style={styles.projectContainer} wrap={false}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectName}>
              {project.title}
              {project.link && project.link !== '-' ? (
                <Text style={{ fontWeight: 'normal', fontSize: 10 }}> - <Link src={project.link} style={styles.link}>View Project</Link></Text>
              ) : null}
            </Text>
            <Text style={styles.projectYear}>{project.year}</Text>
          </View>
          <Text style={styles.projectType}>{project.type}</Text>
          <Text style={styles.projectDescription}>{project.description}</Text>
          {project.technology && project.technology.length > 0 && (
            <Text style={styles.projectTech}>Tech Stack: {project.technology.join(', ')}</Text>
          )}
        </View>
      ))}
    </Page>
  </Document>
);

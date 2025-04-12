'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  location: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  technologies: string[];
}

interface Activity {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CustomSection {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }[];
}

// Add placeholder data for preview
const placeholderData = {
  personalInfo: {
    firstName: 'FIRST',
    lastName: 'LAST',
    email: 'first.last@stacked.com',
    phone: '+44 123456789',
    location: 'New York, NY',
  },
  education: [{
    id: '1',
    school: 'STACKED UNIVERSITY',
    degree: 'Bachelor of Engineering',
    field: 'Computer Science',
    location: 'Boston, MA',
    startDate: '2015',
    endDate: 'Expected May 2019',
    gpa: '3.93/4.0',
    description: "Major in Computer Science; Minors in Mathematics and Psychology\nDean's List 2015-2016\nRelevant Coursework: Data Analysis, Software Engineering; Operating Systems; Algorithms; Artificial Intelligence"
  }],
  experience: [{
    id: '1',
    company: 'STACKED & CO.',
    position: 'Data Science Intern',
    location: 'New York, NY',
    startDate: 'Jun 2017',
    endDate: 'Sep 2017',
    description: 'Built Tableau dashboard to visualize core business KPIs (e.g. Monthly Recurring Revenue), saving 10 hours per week of manual reporting work\nAggregated unstructured data from 20+ sources to build the foundation of a new product; led to $100,000 in new revenue\nDesigned the data pipeline architecture in team of 5 for a new product that scaled from 0 to 100,000 daily active users'
  }],
  projects: [{
    id: '1',
    title: 'Machine Learning Project',
    description: 'Developed a machine learning model to predict customer churn with 85% accuracy',
    startDate: 'Jan 2023',
    endDate: 'Mar 2023',
    technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas']
  }],
  activities: [{
    id: '1',
    title: 'Volunteer Work',
    organization: 'Local Community Center',
    startDate: 'Jan 2022',
    endDate: 'Present',
    description: 'Organized weekly coding workshops for underprivileged youth'
  }],
  skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git']
};

// Update all input field classes to use consistent padding
const inputClassName = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-3";
const textareaClassName = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-3";

const ResumeBuilder = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
  });

  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [sections, setSections] = useState<{
    education: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    activities: boolean;
  }>({
    education: true,
    experience: true,
    projects: true,
    skills: true,
    activities: true,
  });

  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'education',
    'experience',
    'projects',
    'activities',
    'skills',
  ]);

  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: 'New Section',
      items: [{
        id: Date.now().toString(),
        title: '',
        description: '',
        startDate: '',
        endDate: '',
      }],
    };
    setCustomSections([...customSections, newSection]);
    setSectionOrder([...sectionOrder, newSection.id]);
  };

  // Function to get display data (user input or placeholder)
  const getDisplayData = () => {
    return {
      personalInfo: {
        firstName: personalInfo.firstName || placeholderData.personalInfo.firstName,
        lastName: personalInfo.lastName || placeholderData.personalInfo.lastName,
        email: personalInfo.email || placeholderData.personalInfo.email,
        phone: personalInfo.phone || placeholderData.personalInfo.phone,
        location: personalInfo.location || placeholderData.personalInfo.location,
      },
      education: education.length > 0 ? education : placeholderData.education,
      experience: experience.length > 0 ? experience : placeholderData.experience,
      projects: projects.length > 0 ? projects : placeholderData.projects,
      activities: activities.length > 0 ? activities : placeholderData.activities,
      skills: skills.length > 0 ? skills : placeholderData.skills,
    };
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const exportToPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        throw new Error('Resume preview element not found');
      }

      // Force a re-render of the content
      const displayData = getDisplayData();
      
      // Create canvas with higher resolution and wait for fonts to load
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Ensure all fonts are loaded
          const style = document.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap');
            * { -webkit-print-color-adjust: exact !important; }
          `;
          clonedDoc.head.appendChild(style);

          // Ensure all content is visible
          const preview = clonedDoc.getElementById('resume-preview');
          if (preview) {
            preview.style.overflow = 'visible';
            preview.style.height = 'auto';
            preview.style.maxHeight = 'none';
          }
        },
        allowTaint: true,
        foreignObjectRendering: true
      });

      // Configure PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.5, 11]
      });

      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 7.5;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = (8.5 - imgWidth) / 2;
      const yOffset = 0.5;

      // Add the image to PDF with better quality
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      
      // Save the PDF with proper filename
      const filename = `${displayData.personalInfo.firstName || 'resume'}_resume.pdf`;
      pdf.save(filename);
      showToast('Resume exported successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to export resume. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Resume Builder
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create a professional resume that highlights your skills and experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Form Section */}
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className={inputClassName}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Section Manager */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Manage Sections
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(sections).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <span className="capitalize">{key}</span>
                      <button
                        onClick={() => setSections({ ...sections, [key]: !enabled })}
                        className={`px-3 py-1 rounded-md ${
                          enabled
                            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'
                        }`}
                      >
                        {enabled ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addCustomSection}
                  className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  Add Custom Section
                </button>
              </div>
            </div>

            {/* Existing sections wrapped in conditions */}
            {sections.education && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Education
                  </h2>
                  <button
                    onClick={() => {
                      setEducation([
                        ...education,
                        {
                          id: Date.now().toString(),
                          school: '',
                          degree: '',
                          field: '',
                          startDate: '',
                          endDate: '',
                          gpa: '',
                          location: '',
                          description: '',
                        },
                      ]);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => {
                            setEducation(education.filter(e => e.id !== edu.id));
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Education
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            School
                          </label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => {
                              setEducation(
                                education.map((item) =>
                                  item.id === edu.id ? { ...item, school: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              setEducation(
                                education.map((item) =>
                                  item.id === edu.id ? { ...item, degree: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => {
                              setEducation(
                                education.map((item) =>
                                  item.id === edu.id ? { ...item, field: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            GPA
                          </label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => {
                              setEducation(
                                education.map((item) =>
                                  item.id === edu.id ? { ...item, gpa: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => {
                              setEducation(
                                education.map((item) =>
                                  item.id === edu.id ? { ...item, startDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => {
                              setEducation(
                                education.map((item) =>
                                  item.id === edu.id ? { ...item, endDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.experience && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Work Experience
                  </h2>
                  <button
                    onClick={() => {
                      setExperience([
                        ...experience,
                        {
                          id: Date.now().toString(),
                          company: '',
                          position: '',
                          startDate: '',
                          endDate: '',
                          location: '',
                          description: '',
                        },
                      ]);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => {
                            setExperience(experience.filter(e => e.id !== exp.id));
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Experience
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id ? { ...item, company: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Position
                          </label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id ? { ...item, position: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id ? { ...item, startDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id ? { ...item, endDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Job Responsibilities & Achievements
                        </label>
                        <div className="space-y-2">
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id ? { ...item, description: e.target.value } : item
                                )
                              );
                            }}
                            rows={3}
                            className={textareaClassName}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.projects && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Projects
                  </h2>
                  <button
                    onClick={() => {
                      setProjects([
                        ...projects,
                        {
                          id: Date.now().toString(),
                          title: '',
                          description: '',
                          startDate: '',
                          endDate: '',
                          technologies: [],
                        },
                      ]);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Add Project
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => {
                            setProjects(projects.filter(p => p.id !== project.id));
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Project
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => {
                              setProjects(
                                projects.map((item) =>
                                  item.id === project.id ? { ...item, title: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <textarea
                            value={project.description}
                            onChange={(e) => {
                              setProjects(
                                projects.map((item) =>
                                  item.id === project.id ? { ...item, description: e.target.value } : item
                                )
                              );
                            }}
                            rows={3}
                            className={textareaClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={project.startDate}
                            onChange={(e) => {
                              setProjects(
                                projects.map((item) =>
                                  item.id === project.id ? { ...item, startDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <input
                            type="month"
                            value={project.endDate}
                            onChange={(e) => {
                              setProjects(
                                projects.map((item) =>
                                  item.id === project.id ? { ...item, endDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Technologies
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                <input
                                  type="text"
                                  value={tech}
                                  onChange={(e) => {
                                    const newTechs = [...project.technologies];
                                    newTechs[index] = e.target.value;
                                    setProjects(
                                      projects.map((item) =>
                                        item.id === project.id ? { ...item, technologies: newTechs } : item
                                      )
                                    );
                                  }}
                                  className="bg-transparent border-none focus:ring-0 p-0"
                                  placeholder="Technology"
                                />
                                <button
                                  onClick={() => {
                                    const newTechs = project.technologies.filter((_, i) => i !== index);
                                    setProjects(
                                      projects.map((item) =>
                                        item.id === project.id ? { ...item, technologies: newTechs } : item
                                      )
                                    );
                                  }}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                setProjects(
                                  projects.map((item) =>
                                    item.id === project.id
                                      ? { ...item, technologies: [...item.technologies, ''] }
                                      : item
                                  )
                                );
                              }}
                              className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                              + Add Technology
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.skills && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Skills
                  </h2>
                  <button
                    onClick={() => {
                      setSkills([
                        ...skills,
                        '',
                      ]);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Add Skill
                  </button>
                </div>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [...skills];
                            newSkills[index] = e.target.value;
                            setSkills(newSkills);
                          }}
                          className={inputClassName}
                          placeholder="Enter skill"
                        />
                        <button
                          onClick={() => {
                            const newSkills = [...skills];
                            newSkills.splice(index, 1);
                            setSkills(newSkills);
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Section */}
            {sections.activities && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Activities
                  </h2>
                  <button
                    onClick={() => {
                      setActivities([
                        ...activities,
                        {
                          id: Date.now().toString(),
                          title: '',
                          organization: '',
                          startDate: '',
                          endDate: '',
                          description: '',
                        },
                      ]);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Add Activity
                  </button>
                </div>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => {
                            setActivities(activities.filter(a => a.id !== activity.id));
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Activity
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                          </label>
                          <input
                            type="text"
                            value={activity.title}
                            onChange={(e) => {
                              setActivities(
                                activities.map((item) =>
                                  item.id === activity.id ? { ...item, title: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Organization
                          </label>
                          <input
                            type="text"
                            value={activity.organization}
                            onChange={(e) => {
                              setActivities(
                                activities.map((item) =>
                                  item.id === activity.id ? { ...item, organization: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={activity.startDate}
                            onChange={(e) => {
                              setActivities(
                                activities.map((item) =>
                                  item.id === activity.id ? { ...item, startDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <input
                            type="month"
                            value={activity.endDate}
                            onChange={(e) => {
                              setActivities(
                                activities.map((item) =>
                                  item.id === activity.id ? { ...item, endDate: e.target.value } : item
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <textarea
                            value={activity.description}
                            onChange={(e) => {
                              setActivities(
                                activities.map((item) =>
                                  item.id === activity.id ? { ...item, description: e.target.value } : item
                                )
                              );
                            }}
                            rows={3}
                            className={textareaClassName}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {customSections.map((section) => (
              <div key={section.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      setCustomSections(
                        customSections.map((s) =>
                          s.id === section.id ? { ...s, title: e.target.value } : s
                        )
                      );
                    }}
                    className={inputClassName}
                    placeholder="Section Title"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCustomSections(
                          customSections.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items: [
                                    ...s.items,
                                    { 
                                      id: Date.now().toString(),
                                      title: '',
                                      description: '',
                                      startDate: '',
                                      endDate: ''
                                    },
                                  ],
                                }
                              : s
                          )
                        );
                      }}
                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors duration-200 ml-4"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => {
                        setCustomSections(customSections.filter((s) => s.id !== section.id));
                        setSectionOrder(sectionOrder.filter((id) => id !== section.id));
                      }}
                      className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Remove Section
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => {
                            setCustomSections(
                              customSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items: s.items.filter((i) => i.id !== item.id),
                                    }
                                  : s
                              )
                            );
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Item
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              setCustomSections(
                                customSections.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        items: s.items.map((i) =>
                                          i.id === item.id ? { ...i, title: e.target.value } : i
                                        ),
                                      }
                                    : s
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <input
                            type="month"
                            value={item.startDate}
                            onChange={(e) => {
                              setCustomSections(
                                customSections.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        items: s.items.map((i) =>
                                          i.id === item.id ? { ...i, startDate: e.target.value } : i
                                        ),
                                      }
                                    : s
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <input
                            type="month"
                            value={item.endDate}
                            onChange={(e) => {
                              setCustomSections(
                                customSections.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        items: s.items.map((i) =>
                                          i.id === item.id ? { ...i, endDate: e.target.value } : i
                                        ),
                                      }
                                    : s
                                )
                              );
                            }}
                            className={inputClassName}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description (one bullet point per line)
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              setCustomSections(
                                customSections.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        items: s.items.map((i) =>
                                          i.id === item.id ? { ...i, description: e.target.value } : i
                                        ),
                                      }
                                    : s
                                )
                              );
                            }}
                            rows={3}
                            className={textareaClassName}
                            placeholder="Enter bullet points, one per line"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Resume Preview
              </h2>
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className={`px-6 py-2.5 rounded-lg text-white transition-all duration-200 ${
                  isExporting 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                title={isExporting ? "Exporting resume..." : "Export resume as PDF"}
              >
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
            <div 
              id="resume-preview"
              className="bg-white shadow-lg mx-auto" 
              style={{ 
                maxWidth: '8.5in', 
                minHeight: '11in',
                maxHeight: '11in',
                fontFamily: '"EB Garamond", serif',
                fontSize: '11px',
                lineHeight: '1.15',
                border: '1px solid #e5e7eb',
                position: 'relative',
                pageBreakInside: 'avoid',
                padding: '0.5in',
                boxSizing: 'border-box',
                overflowY: 'auto',
                color: '#000000',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}>
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-lg mb-1" style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600 }}>
                  {(getDisplayData().personalInfo.firstName + ' ' + getDisplayData().personalInfo.lastName).toUpperCase()}
                </h1>
                <div className="text-xs">
                  {getDisplayData().personalInfo.location} | P: {getDisplayData().personalInfo.phone} | {getDisplayData().personalInfo.email}
                </div>
              </div>

              {/* Education Section in Preview */}
              {sections.education && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Education
                  </h2>
                  {getDisplayData().education.map((edu) => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{edu.school}</div>
                        <div>{edu.startDate} – {edu.endDate}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>{edu.degree} in {edu.field}</div>
                        <div>{edu.location}</div>
                      </div>
                      {edu.gpa && <div>GPA: {edu.gpa}</div>}
                      <ul className="list-disc ml-4 mb-0 mt-1">
                        {edu.description.split('\n').map((desc, index) => (
                          desc.trim() && <li key={index} className="mb-0">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Work Experience Section in Preview */}
              {sections.experience && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Work Experience
                  </h2>
                  {getDisplayData().experience.map((exp) => (
                    <div key={exp.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{exp.company}</div>
                        <div>{exp.startDate} – {exp.endDate}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>{exp.position}</div>
                        <div>{exp.location}</div>
                      </div>
                      <ul className="list-disc ml-4 mb-0 mt-1">
                        {exp.description.split('\n').map((desc, index) => (
                          desc.trim() && <li key={index} className="mb-0">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section in Preview */}
              {sections.projects && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Projects
                  </h2>
                  {getDisplayData().projects.map((project) => (
                    <div key={project.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{project.title}</div>
                        <div>{project.startDate} – {project.endDate}</div>
                      </div>
                      <ul className="list-disc ml-4 mb-0 mt-1">
                        {project.description.split('\n').map((desc, index) => (
                          desc.trim() && <li key={index} className="mb-0">{desc}</li>
                        ))}
                      </ul>
                      {project.technologies.length > 0 && (
                        <div className="mt-1">
                          <span className="font-semibold">Technologies: </span>
                          {project.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Activities Section in Preview */}
              {sections.activities && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Activities
                  </h2>
                  {getDisplayData().activities.map((activity) => (
                    <div key={activity.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{activity.title}</div>
                        <div>{activity.startDate} – {activity.endDate}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>{activity.organization}</div>
                      </div>
                      <ul className="list-disc ml-4 mb-0 mt-1">
                        {activity.description.split('\n').map((desc, index) => (
                          desc.trim() && <li key={index} className="mb-0">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section in Preview */}
              {sections.skills && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Skills
                  </h2>
                  <ul className="list-disc ml-4 mb-0 mt-0">
                    {getDisplayData().skills.map((skill, index) => (
                      <li key={index} className="mb-0">{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Custom Sections in Preview */}
              {customSections.map((section) => (
                <div key={section.id} className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    {section.title}
                  </h2>
                  {section.items.map((item) => (
                    <div key={item.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{item.title}</div>
                        <div>
                          {item.startDate && new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {item.endDate && ` – ${new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        </div>
                      </div>
                      <ul className="list-disc ml-4 mb-0 mt-0">
                        {item.description.split('\n').map((desc, index) => (
                          desc.trim() && <li key={index} className="mb-0">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder; 
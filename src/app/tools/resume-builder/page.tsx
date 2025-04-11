'use client';

import { useState } from 'react';

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
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface Skill {
  id: string;
  category: string;
  items: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
  achievements?: string[];
}

interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
}

interface CustomSection {
  id: string;
  title: string;
  items: {
    id: string;
    content: string[];
  }[];
}

interface Activity {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
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
    achievements: [
      "Major in Computer Science; Minors in Mathematics and Psychology",
      "Dean's List 2015-2016",
      "Relevant Coursework: Data Analysis, Software Engineering; Operating Systems; Algorithms; Artificial Intelligence"
    ]
  }],
  experience: [{
    id: '1',
    company: 'STACKED & CO.',
    position: 'Data Science Intern',
    location: 'New York, NY',
    startDate: 'Jun 2017',
    endDate: 'Sep 2017',
    current: false,
    description: [
      'Built Tableau dashboard to visualize core business KPIs (e.g. Monthly Recurring Revenue), saving 10 hours per week of manual reporting work',
      'Aggregated unstructured data from 20+ sources to build the foundation of a new product; led to $100,000 in new revenue',
      'Designed the data pipeline architecture in team of 5 for a new product that scaled from 0 to 100,000 daily active users'
    ]
  }, {
    id: '2',
    company: 'EXCITING COMPANY',
    position: 'Data Analyst Intern',
    location: 'New York, NY',
    startDate: 'Jun 2016',
    endDate: 'Sep 2016',
    current: false,
    description: [
      'Led the transition to a paperless practice by implementing an electronic booking system and a faster, safer and more accurate business system; reduced cost of labor by 30% and office overhead by 10%',
      'Analyzed data from 25,000 monthly active users and used outputs to guide marketing and product strategies; increased average app engagement time by 2x, 30% decrease in drop rate, and 3x shares on social media'
    ]
  }],
  activities: [{
    id: '1',
    organization: 'STACKED FINANCE SOCIETY',
    role: 'Head of Events',
    location: 'Boston, MA',
    startDate: 'Sep 2017',
    endDate: 'Present',
    description: [
      'Founded the first ever Business Series to organize finance training for 500 students',
      'Organized and advertised 10+ quarterly networking events with 300+ participants in 3 universities in Boston'
    ]
  }, {
    id: '2',
    organization: 'STACKED TENNIS SOCIETY',
    role: 'Committee Member',
    location: 'Boston, MA',
    startDate: 'Jan 2017',
    endDate: 'Present',
    description: [
      'Managed the launch of new booking system to improve organization of events; system now used across university'
    ]
  }],
  projects: [{
    id: '1',
    name: 'RECOMMENDATION ENGINE',
    description: 'Designed and implemented movie recommendation application in 4-person team using Python in 3-day hackathon',
    technologies: ['Python', 'Machine Learning'],
    startDate: 'Feb 2017',
    endDate: 'Feb 2017',
    current: false,
    achievements: ['Enabled users to be recommended movies based on 50+ data points; awarded most innovative project by Google engineer']
  }, {
    id: '2',
    name: 'PINTOS - MODEL OPERATING SYSTEM',
    description: 'Designed and implemented Unix-based operating system in 4-person team using C++',
    technologies: ['C++', 'Operating Systems'],
    startDate: 'Jan 2016',
    endDate: 'Jan 2016',
    current: false,
    achievements: ["Awarded First Prize in Computing's Senior Design Projects (out of 100 teams)"]
  }],
  skills: [{
    id: '1',
    category: 'Technical Skills',
    items: ['Advanced in SQL, PHP, Javascript, HTML/CSS; Proficient in MATLAB, Python']
  }, {
    id: '2',
    category: 'Languages',
    items: ['Fluent in French, English; Conversational Proficiency in Italian, German']
  }, {
    id: '3',
    category: 'Certifications & Training',
    items: ['Online Course in Management (Coursera), Passed Stacked examinations']
  }, {
    id: '4',
    category: 'Awards',
    items: ["Stacked's Top 30 Under 30 (2011); Won Stacked's nationwide case competition out of 500+ participants (2013)"]
  }]
};

export default function ResumeBuilder() {
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

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

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: 'New Section',
      items: [{
        id: Date.now().toString(),
        content: [''],
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                          location: '',
                          startDate: '',
                          endDate: '',
                          gpa: '',
                          achievements: [''],
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Achievements & Leadership Roles
                        </label>
                        <div className="space-y-2">
                          {edu.achievements?.map((achievement, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={achievement}
                                onChange={(e) => {
                                  const newAchievements = [...(edu.achievements || [])];
                                  newAchievements[index] = e.target.value;
                                  setEducation(
                                    education.map((item) =>
                                      item.id === edu.id ? { ...item, achievements: newAchievements } : item
                                    )
                                  );
                                }}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <button
                                onClick={() => {
                                  const newAchievements = [...(edu.achievements || [])];
                                  newAchievements.splice(index, 1);
                                  setEducation(
                                    education.map((item) =>
                                      item.id === edu.id ? { ...item, achievements: newAchievements } : item
                                    )
                                  );
                                }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setEducation(
                                education.map((item) =>
                                  item.id === edu.id
                                    ? { ...item, achievements: [...(item.achievements || []), ''] }
                                    : item
                                )
                              );
                            }}
                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            + Add Achievement
                          </button>
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
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          description: [''],
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Location
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id ? { ...item, location: e.target.value } : item
                                )
                              );
                            }}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id ? { ...item, current: e.target.checked } : item
                                )
                              );
                            }}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Current Position
                          </label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Job Responsibilities & Achievements
                        </label>
                        <div className="space-y-2">
                          {exp.description.map((desc, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={desc}
                                onChange={(e) => {
                                  const newDescription = [...exp.description];
                                  newDescription[index] = e.target.value;
                                  setExperience(
                                    experience.map((item) =>
                                      item.id === exp.id ? { ...item, description: newDescription } : item
                                    )
                                  );
                                }}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <button
                                onClick={() => {
                                  const newDescription = [...exp.description];
                                  newDescription.splice(index, 1);
                                  setExperience(
                                    experience.map((item) =>
                                      item.id === exp.id ? { ...item, description: newDescription } : item
                                    )
                                  );
                                }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setExperience(
                                experience.map((item) =>
                                  item.id === exp.id
                                    ? { ...item, description: [...item.description, ''] }
                                    : item
                                )
                              );
                            }}
                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            + Add Responsibility
                          </button>
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
                          name: '',
                          description: '',
                          technologies: [''],
                          startDate: '',
                          endDate: '',
                          current: false,
                          achievements: [''],
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Project Name
                          </label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => {
                              setProjects(
                                projects.map((item) =>
                                  item.id === project.id ? { ...item, name: e.target.value } : item
                                )
                              );
                            }}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Project URL
                          </label>
                          <input
                            type="url"
                            value={project.url}
                            onChange={(e) => {
                              setProjects(
                                projects.map((item) =>
                                  item.id === project.id ? { ...item, url: e.target.value } : item
                                )
                              );
                            }}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={project.current}
                            onChange={(e) => {
                              setProjects(
                                projects.map((item) =>
                                  item.id === project.id ? { ...item, current: e.target.checked } : item
                                )
                              );
                            }}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Ongoing Project
                          </label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Technologies Used
                        </label>
                        <div className="space-y-2">
                          {project.technologies.map((tech, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={tech}
                                onChange={(e) => {
                                  const newTech = [...project.technologies];
                                  newTech[index] = e.target.value;
                                  setProjects(
                                    projects.map((item) =>
                                      item.id === project.id ? { ...item, technologies: newTech } : item
                                    )
                                  );
                                }}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <button
                                onClick={() => {
                                  const newTech = [...project.technologies];
                                  newTech.splice(index, 1);
                                  setProjects(
                                    projects.map((item) =>
                                      item.id === project.id ? { ...item, technologies: newTech } : item
                                    )
                                  );
                                }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Remove
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
                        {
                          id: Date.now().toString(),
                          category: '',
                          items: [''],
                        },
                      ]);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Add Skill Category
                  </button>
                </div>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </label>
                        <input
                          type="text"
                          value={skill.category}
                          onChange={(e) => {
                            setSkills(
                              skills.map((item) =>
                                item.id === skill.id ? { ...item, category: e.target.value } : item
                              )
                            );
                          }}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Skills
                        </label>
                        <div className="space-y-2">
                          {skill.items.map((item, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const newItems = [...skill.items];
                                  newItems[index] = e.target.value;
                                  setSkills(
                                    skills.map((s) =>
                                      s.id === skill.id ? { ...s, items: newItems } : s
                                    )
                                  );
                                }}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <button
                                onClick={() => {
                                  const newItems = [...skill.items];
                                  newItems.splice(index, 1);
                                  setSkills(
                                    skills.map((s) =>
                                      s.id === skill.id ? { ...s, items: newItems } : s
                                    )
                                  );
                                }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setSkills(
                                skills.map((s) =>
                                  s.id === skill.id ? { ...s, items: [...s.items, ''] } : s
                                )
                              );
                            }}
                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            + Add Skill
                          </button>
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
                    className="text-xl font-semibold bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
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
                                    { id: Date.now().toString(), content: [''] },
                                  ],
                                }
                              : s
                          )
                        );
                      }}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => {
                        setCustomSections(customSections.filter((s) => s.id !== section.id));
                        setSectionOrder(sectionOrder.filter((id) => id !== section.id));
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Remove Section
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="space-y-2">
                        {item.content.map((line, lineIndex) => (
                          <div key={lineIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={line}
                              onChange={(e) => {
                                const newContent = [...item.content];
                                newContent[lineIndex] = e.target.value;
                                setCustomSections(
                                  customSections.map((s) =>
                                    s.id === section.id
                                      ? {
                                          ...s,
                                          items: s.items.map((i) =>
                                            i.id === item.id
                                              ? { ...i, content: newContent }
                                              : i
                                          ),
                                        }
                                      : s
                                  )
                                );
                              }}
                              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="Enter text"
                            />
                            <button
                              onClick={() => {
                                const newContent = [...item.content];
                                newContent.splice(lineIndex, 1);
                                setCustomSections(
                                  customSections.map((s) =>
                                    s.id === section.id
                                      ? {
                                          ...s,
                                          items: s.items.map((i) =>
                                            i.id === item.id
                                              ? { ...i, content: newContent }
                                              : i
                                          ),
                                        }
                                      : s
                                  )
                                );
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setCustomSections(
                              customSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items: s.items.map((i) =>
                                        i.id === item.id
                                          ? { ...i, content: [...i.content, ''] }
                                          : i
                                      ),
                                    }
                                  : s
                              )
                            );
                          }}
                          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          + Add Line
                        </button>
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Resume Preview
            </h2>
            <div className="bg-white shadow-lg mx-auto" style={{ 
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
              color: '#000000'
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

              {/* Education Section */}
              {sections.education && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Education
                  </h2>
                  {getDisplayData().education.map((edu) => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{edu.school}</div>
                        <div>{edu.location}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Focus in {edu.field}</div>
                        <div>{edu.endDate}</div>
                      </div>
                      <div>Cumulative GPA: {edu.gpa}</div>
                      <div>Activities/Clubs: {edu.achievements?.join('; ')}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Work Experience Section */}
              {sections.experience && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Work Experience
                  </h2>
                  {getDisplayData().experience.map((exp) => (
                    <div key={exp.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{exp.company}</div>
                        <div>{exp.location}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>{exp.position}</div>
                        <div>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                      </div>
                      <ul className="list-disc ml-4 mb-0 mt-0">
                        {exp.description.map((desc, index) => (
                          <li key={index} className="mb-0">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section */}
              {sections.projects && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Projects
                  </h2>
                  {getDisplayData().projects.map((project) => (
                    <div key={project.id} className="mb-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{project.name}</div>
                        <div>{project.startDate}</div>
                      </div>
                      <ul className="list-disc ml-4 mb-0 mt-0">
                        {project.achievements?.map((achievement, index) => (
                          <li key={index} className="mb-0">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Awards Section */}
              {sections.activities && (
                <div className="mb-3">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Awards
                  </h2>
                  {getDisplayData().activities.map((activity) => (
                    <div key={activity.id} className="mb-1">
                      <div className="flex justify-between">
                        <div className="font-bold">{activity.organization}</div>
                        <div>{activity.location}</div>
                      </div>
                      <ul className="list-disc ml-4 mb-0 mt-0">
                        {activity.description.map((desc, index) => (
                          <li key={index} className="mb-0">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Additional Section */}
              {sections.skills && (
                <div className="mb-0">
                  <h2 className="text-xs uppercase border-b border-gray-400 mb-1 font-bold">
                    Additional
                  </h2>
                  {getDisplayData().skills.map((skill) => (
                    <div key={skill.id} className="mb-1">
                      <span className="font-bold">{skill.category}: </span>
                      {skill.items.join('; ')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
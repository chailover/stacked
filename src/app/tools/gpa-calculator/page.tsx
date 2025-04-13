'use client';

import { useLocalStorage } from '@/utils/useLocalStorage';

interface Grade {
  subject: string;
  numericalGrade: string;
  weight: 'cp' | 'honors' | 'ap';
  credits: number;
  semester?: 1 | 2;  // Optional semester assignment
}

interface Year {
  name: string;
  grades: Grade[];
  isSplit: boolean;  // Whether the year is split into semesters
}

const YEAR_NAMES = ['Freshman Year', 'Sophomore Year', 'Junior Year', 'Senior Year'];

export default function GPACalculator() {
  const [years, setYears] = useLocalStorage<Year[]>('gpa-years', [
    { 
      name: YEAR_NAMES[0], 
      isSplit: false,
      grades: [{ 
        subject: '', 
        numericalGrade: '', 
        weight: 'cp',
        credits: 5,
        semester: undefined 
      }] 
    }
  ]);

  const addYear = () => {
    const yearName = years.length < YEAR_NAMES.length 
      ? YEAR_NAMES[years.length]
      : `Year ${years.length + 1}`;
    
    setYears([...years, { 
      name: yearName,
      isSplit: false,
      grades: [{ 
        subject: '', 
        numericalGrade: '', 
        weight: 'cp',
        credits: 5,
        semester: undefined 
      }] 
    }]);
  };

  const removeYear = (yearIndex: number) => {
    if (years.length > 1) {
      setYears(years.filter((_, index) => index !== yearIndex));
    }
  };

  const addGrade = (yearIndex: number, semester?: 1 | 2) => {
    const newYears = [...years];
    newYears[yearIndex].grades.push({ 
      subject: '', 
      numericalGrade: '', 
      weight: 'cp',
      credits: semester ? 2.5 : 5,
      semester 
    });
    setYears(newYears);
  };

  const removeGrade = (yearIndex: number, gradeIndex: number) => {
    const newYears = [...years];
    if (newYears[yearIndex].grades.length > 1) {
      newYears[yearIndex].grades = newYears[yearIndex].grades.filter((_, index) => index !== gradeIndex);
      setYears(newYears);
    }
  };

  const updateGrade = (yearIndex: number, gradeIndex: number, field: keyof Grade, value: string | number) => {
    const newYears = [...years];
    const grade = newYears[yearIndex].grades[gradeIndex];
    
    if (field === 'weight') {
      grade.weight = value as 'cp' | 'honors' | 'ap';
    } else if (field === 'credits') {
      grade.credits = value as number;
    } else if (field === 'subject' || field === 'numericalGrade') {
      grade[field] = value as string;
    }
    
    setYears(newYears);
  };

  const updateYearName = (yearIndex: number, name: string) => {
    const newYears = [...years];
    newYears[yearIndex].name = name;
    setYears(newYears);
  };

  const getGradePoints = (numericalGrade: string, weight: string, forUnweighted: boolean = false): number => {
    const numGrade = parseInt(numericalGrade);
    if (isNaN(numGrade)) return 0;

    // For unweighted calculations, always use the standard 4.0 scale
    if (forUnweighted) {
      if (numGrade >= 93) return 4.0;  // A+/A
      if (numGrade >= 90) return 3.7;  // A-
      if (numGrade >= 87) return 3.3;  // B+
      if (numGrade >= 83) return 3.0;  // B
      if (numGrade >= 80) return 2.7;  // B-
      if (numGrade >= 77) return 2.3;  // C+
      if (numGrade >= 73) return 2.0;  // C
      if (numGrade >= 70) return 1.7;  // C-
      if (numGrade >= 67) return 1.3;  // D+
      if (numGrade >= 65) return 1.0;  // D
      return 0.0;  // F
    }

    // For weighted calculations, use the appropriate scale
    const scales = {
      ap: [
        { min: 98, max: 100, points: 5.0 },
        { min: 93, max: 97, points: 4.7 },
        { min: 90, max: 92, points: 4.5 },
        { min: 87, max: 89, points: 4.3 },
        { min: 83, max: 86, points: 4.0 },
        { min: 80, max: 82, points: 3.7 },
        { min: 77, max: 79, points: 3.4 },
        { min: 73, max: 76, points: 3.0 },
        { min: 70, max: 72, points: 2.7 },
        { min: 65, max: 69, points: 2.0 },
        { min: 0, max: 64, points: 0.0 }
      ],
      honors: [
        { min: 98, max: 100, points: 4.5 },
        { min: 93, max: 97, points: 4.2 },
        { min: 90, max: 92, points: 4.0 },
        { min: 87, max: 89, points: 3.8 },
        { min: 83, max: 86, points: 3.5 },
        { min: 80, max: 82, points: 3.2 },
        { min: 77, max: 79, points: 2.9 },
        { min: 73, max: 76, points: 2.5 },
        { min: 70, max: 72, points: 2.2 },
        { min: 65, max: 69, points: 1.5 },
        { min: 0, max: 64, points: 0.0 }
      ],
      cp: [
        { min: 98, max: 100, points: 4.0 },
        { min: 93, max: 97, points: 3.7 },
        { min: 90, max: 92, points: 3.5 },
        { min: 87, max: 89, points: 3.3 },
        { min: 83, max: 86, points: 3.0 },
        { min: 80, max: 82, points: 2.7 },
        { min: 77, max: 79, points: 2.4 },
        { min: 73, max: 76, points: 2.0 },
        { min: 70, max: 72, points: 1.7 },
        { min: 65, max: 69, points: 1.0 },
        { min: 0, max: 64, points: 0.0 }
      ]
    };

    const scale = scales[weight as keyof typeof scales];
    if (!scale) return 0;  // Handle invalid weight type
    
    const range = scale.find(r => numGrade >= r.min && numGrade <= r.max);
    return range ? range.points : 0;
  };



  const calculateGPA = (grades: Grade[], useWeighted: boolean = true) => {
    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach((grade) => {
      if (grade.numericalGrade && grade.subject) {
        const points = getGradePoints(grade.numericalGrade, grade.weight, !useWeighted);
        totalPoints += points * grade.credits;
        totalCredits += grade.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateSemesterGPA = (year: Year, semester: 1 | 2, useWeighted: boolean = true) => {
    const semesterGrades = year.grades.filter(g => g.semester === semester);
    return calculateGPA(semesterGrades, useWeighted);
  };

  const calculateYearGPA = (year: Year, useWeighted: boolean = true) => {
    return calculateGPA(year.grades, useWeighted);
  };

  const calculateOverallGPA = (useWeighted: boolean = true) => {
    let totalPoints = 0;
    let totalCredits = 0;

    years.forEach((year) => {
      year.grades.forEach((grade) => {
        if (grade.numericalGrade && grade.subject) {
          const points = getGradePoints(grade.numericalGrade, grade.weight, !useWeighted);
          totalPoints += points * grade.credits;
          totalCredits += grade.credits;
        }
      });
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const toggleSemesterSplit = (yearIndex: number) => {
    const newYears = [...years];
    const year = newYears[yearIndex];
    
    if (!year.isSplit) {
      // Convert full-year courses to semester 1
      year.grades.forEach(grade => {
        if (grade.credits === 5) {
          grade.credits = 2.5;
          grade.semester = 1;
        }
      });
    } else {
      // Convert all courses back to full year
      year.grades.forEach(grade => {
        delete grade.semester;
        grade.credits = 5;
      });
    }
    
    year.isSplit = !year.isSplit;
    setYears(newYears);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              GPA Calculator
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Calculate your weighted and unweighted GPA across multiple years
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Calculator Section */}
          <div className="flex-1">
            <div className="space-y-8">
              {years.map((year, yearIndex) => (
                <div key={yearIndex} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={year.name}
                        onChange={(e) => updateYearName(yearIndex, e.target.value)}
                        className="text-xl font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none min-w-0 max-w-[200px]"
                      />
                      <button
                        onClick={() => toggleSemesterSplit(yearIndex)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {year.isSplit ? 'Combine Semesters' : 'Split into Semesters'}
                      </button>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => addGrade(yearIndex, year.isSplit ? 1 : undefined)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Add Class
                      </button>
                      {years.length > 1 && (
                        <button
                          onClick={() => removeYear(yearIndex)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                        >
                          Remove Year
                        </button>
                      )}
                    </div>
                  </div>

                  {year.isSplit ? (
                    <>
                      {/* Semester 1 */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                          First Semester
                          <button
                            onClick={() => addGrade(yearIndex, 1)}
                            className="ml-4 text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Add Class
                          </button>
                        </h4>
                        <div className="space-y-4">
                          {year.grades
                            .filter(g => g.semester === 1)
                            .map((grade, gradeIndex) => (
                              <div key={gradeIndex} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <input
                                  type="text"
                                  value={grade.subject}
                                  onChange={(e) => updateGrade(yearIndex, year.grades.indexOf(grade), 'subject', e.target.value)}
                                  placeholder="Subject"
                                  className="w-[250px] rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <input
                                  type="text"
                                  value={grade.numericalGrade}
                                  onChange={(e) => updateGrade(yearIndex, year.grades.indexOf(grade), 'numericalGrade', e.target.value)}
                                  placeholder="Grade"
                                  className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <select
                                  value={grade.weight}
                                  onChange={(e) => updateGrade(yearIndex, year.grades.indexOf(grade), 'weight', e.target.value)}
                                  className="w-36 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                  <option value="cp">College Prep</option>
                                  <option value="honors">Honors</option>
                                  <option value="ap">AP</option>
                                </select>
                                <button
                                  onClick={() => removeGrade(yearIndex, year.grades.indexOf(grade))}
                                  className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors duration-200"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Weighted GPA</p>
                              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                {calculateSemesterGPA(year, 1, true)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Unweighted GPA</p>
                              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                {calculateSemesterGPA(year, 1, false)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Semester 2 */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                          Second Semester
                          <button
                            onClick={() => addGrade(yearIndex, 2)}
                            className="ml-4 text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Add Class
                          </button>
                        </h4>
                        <div className="space-y-4">
                          {year.grades
                            .filter(g => g.semester === 2)
                            .map((grade, gradeIndex) => (
                              <div key={gradeIndex} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <input
                                  type="text"
                                  value={grade.subject}
                                  onChange={(e) => updateGrade(yearIndex, year.grades.indexOf(grade), 'subject', e.target.value)}
                                  placeholder="Subject"
                                  className="w-[250px] rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <input
                                  type="text"
                                  value={grade.numericalGrade}
                                  onChange={(e) => updateGrade(yearIndex, year.grades.indexOf(grade), 'numericalGrade', e.target.value)}
                                  placeholder="Grade"
                                  className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <select
                                  value={grade.weight}
                                  onChange={(e) => updateGrade(yearIndex, year.grades.indexOf(grade), 'weight', e.target.value)}
                                  className="w-36 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                  <option value="cp">College Prep</option>
                                  <option value="honors">Honors</option>
                                  <option value="ap">AP</option>
                                </select>
                                <button
                                  onClick={() => removeGrade(yearIndex, year.grades.indexOf(grade))}
                                  className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors duration-200"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Weighted GPA</p>
                              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                {calculateSemesterGPA(year, 2, true)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Unweighted GPA</p>
                              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                {calculateSemesterGPA(year, 2, false)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {year.grades.map((grade, gradeIndex) => (
                          <div key={gradeIndex} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <input
                              type="text"
                              value={grade.subject}
                              onChange={(e) => updateGrade(yearIndex, gradeIndex, 'subject', e.target.value)}
                              placeholder="Subject"
                              className="w-[250px] rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              value={grade.numericalGrade}
                              onChange={(e) => updateGrade(yearIndex, gradeIndex, 'numericalGrade', e.target.value)}
                              placeholder="Grade"
                              className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <select
                              value={grade.weight}
                              onChange={(e) => updateGrade(yearIndex, gradeIndex, 'weight', e.target.value)}
                              className="w-36 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <option value="cp">College Prep</option>
                              <option value="honors">Honors</option>
                              <option value="ap">AP</option>
                            </select>
                            {year.grades.length > 1 && (
                              <button
                                onClick={() => removeGrade(yearIndex, gradeIndex)}
                                className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {year.name} GPA
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Weighted GPA</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                              {calculateYearGPA(year, true)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Unweighted GPA</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {calculateYearGPA(year, false)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <button
                onClick={addYear}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                Add Another Year
              </button>

              <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Cumulative GPA
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Weighted GPA</p>
                    <p className="mt-1 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      {calculateOverallGPA(true)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Using CP/Honors/AP scales
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Unweighted GPA</p>
                    <p className="mt-1 text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                      {calculateOverallGPA(false)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Using standard 4.0 scale
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Scale Reference Panel */}
          <div className="lg:w-80 xl:w-96">
            <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4">
                <h2 className="text-xl font-bold text-white">Grade Scale Reference</h2>
                <p className="text-indigo-100 text-sm mt-1">Points awarded by grade range</p>
              </div>
              
              <div className="p-4">
                <div className="space-y-6">
                  {/* AP Scale */}
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center">
                      <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      AP Classes
                    </h3>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">98-100: 5.0</div>
                      <div className="text-gray-600 dark:text-gray-400">93-97: 4.7</div>
                      <div className="text-gray-600 dark:text-gray-400">90-92: 4.5</div>
                      <div className="text-gray-600 dark:text-gray-400">87-89: 4.3</div>
                      <div className="text-gray-600 dark:text-gray-400">83-86: 4.0</div>
                      <div className="text-gray-600 dark:text-gray-400">80-82: 3.7</div>
                      <div className="text-gray-600 dark:text-gray-400">77-79: 3.4</div>
                      <div className="text-gray-600 dark:text-gray-400">73-76: 3.0</div>
                      <div className="text-gray-600 dark:text-gray-400">70-72: 2.7</div>
                      <div className="text-gray-600 dark:text-gray-400">65-69: 2.0</div>
                      <div className="text-gray-600 dark:text-gray-400">0-64: 0.0</div>
                    </div>
                  </div>

                  {/* Honors Scale */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                      <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mr-2"></span>
                      Honors Classes
                    </h3>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">98-100: 4.5</div>
                      <div className="text-gray-600 dark:text-gray-400">93-97: 4.2</div>
                      <div className="text-gray-600 dark:text-gray-400">90-92: 4.0</div>
                      <div className="text-gray-600 dark:text-gray-400">87-89: 3.8</div>
                      <div className="text-gray-600 dark:text-gray-400">83-86: 3.5</div>
                      <div className="text-gray-600 dark:text-gray-400">80-82: 3.2</div>
                      <div className="text-gray-600 dark:text-gray-400">77-79: 2.9</div>
                      <div className="text-gray-600 dark:text-gray-400">73-76: 2.5</div>
                      <div className="text-gray-600 dark:text-gray-400">70-72: 2.2</div>
                      <div className="text-gray-600 dark:text-gray-400">65-69: 1.5</div>
                      <div className="text-gray-600 dark:text-gray-400">0-64: 0.0</div>
                    </div>
                  </div>

                  {/* College Prep Scale */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      College Prep Classes
                    </h3>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">98-100: 4.0</div>
                      <div className="text-gray-600 dark:text-gray-400">93-97: 3.7</div>
                      <div className="text-gray-600 dark:text-gray-400">90-92: 3.5</div>
                      <div className="text-gray-600 dark:text-gray-400">87-89: 3.3</div>
                      <div className="text-gray-600 dark:text-gray-400">83-86: 3.0</div>
                      <div className="text-gray-600 dark:text-gray-400">80-82: 2.7</div>
                      <div className="text-gray-600 dark:text-gray-400">77-79: 2.4</div>
                      <div className="text-gray-600 dark:text-gray-400">73-76: 2.0</div>
                      <div className="text-gray-600 dark:text-gray-400">70-72: 1.7</div>
                      <div className="text-gray-600 dark:text-gray-400">65-69: 1.0</div>
                      <div className="text-gray-600 dark:text-gray-400">Below 65: 0.0</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Note:</span> The unweighted GPA uses the standard 4.0 scale for all classes, while the weighted GPA uses the CP/Honors/AP scales shown above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
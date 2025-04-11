'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Timer {
  id: string;
  name: string;
  targetDate: string;
  type?: 'exam' | 'competition' | 'other';
  studySchedule?: StudySchedule;
}

interface TimeInput {
  date: string;
  hour: string;
  minute: string;
  ampm: 'AM' | 'PM';
}

interface StudySchedule {
  totalHours: number;
  frequency: 'daily' | 'every_other_day' | 'weekly';
  preferredTime: 'morning' | 'afternoon' | 'evening';
  avoidWeekends: boolean;
  sessions: StudySession[];
}

interface StudySession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  completed: boolean;
}

interface StudyQuestionnaire {
  totalHours: number;
  frequency: 'daily' | 'every_other_day' | 'weekly';
  preferredTime: 'morning' | 'afternoon' | 'evening';
  avoidWeekends: boolean;
}

export default function CountdownTimer() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [newTimer, setNewTimer] = useState<Partial<Timer>>({
    name: '',
    targetDate: '',
    type: 'other',
  });
  const [timeInput, setTimeInput] = useState<TimeInput>({
    date: '',
    hour: '12',
    minute: '00',
    ampm: 'AM',
  });
  const [selectedTimer, setSelectedTimer] = useState<Timer | null>(null);
  const [studyQuestionnaire, setStudyQuestionnaire] = useState<StudyQuestionnaire>({
    totalHours: 0,
    frequency: 'daily',
    preferredTime: 'morning',
    avoidWeekends: true,
  });
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [studyTime, setStudyTime] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timerType, setTimerType] = useState<'test' | 'competition'>('test');
  const [preparationSteps, setPreparationSteps] = useState<PreparationStep[]>([]);
  const currentDate = new Date();

  // Load timers from localStorage on initial render
  useEffect(() => {
    const savedTimers = localStorage.getItem('timers');
    if (savedTimers) {
      setTimers(JSON.parse(savedTimers));
    }
  }, []);

  // Save timers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  const addTimer = () => {
    if (!newTimer.name || !timeInput.date) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert time inputs to ISO string
    const [year, month, day] = timeInput.date.split('-');
    let hour = parseInt(timeInput.hour);
    if (timeInput.ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (timeInput.ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    const minute = parseInt(timeInput.minute);

    const targetDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour,
      minute
    ).toISOString();

    const timer: Timer = {
      id: Date.now().toString() + Math.random(),
      name: newTimer.name,
      targetDate,
      type: newTimer.type || 'other',
      studySchedule: {
        totalHours: 0,
        frequency: 'daily',
        preferredTime: 'morning',
        avoidWeekends: true,
        sessions: [],
      },
    };

    setTimers([...timers, timer]);
    setSelectedTimer(timer);
    setNewTimer({ name: '', targetDate: '', type: 'other' });
    setTimeInput({
      date: '',
      hour: '12',
      minute: '00',
      ampm: 'AM',
    });

    // Show questionnaire for exams and competitions
    if (timer.type === 'exam' || timer.type === 'competition') {
      setShowQuestionnaire(true);
    }
  };

  const deleteTimer = (id: string) => {
    setTimers(timers.filter(timer => timer.id !== id));
    if (selectedTimer?.id === id) {
      setSelectedTimer(null);
    }
  };

  const handleTimeChange = (field: keyof TimeInput, value: string) => {
    if (field === 'hour') {
      const num = parseInt(value);
      if (value === '' || (num >= 1 && num <= 12)) {
        setTimeInput({ ...timeInput, hour: value });
      }
    } else if (field === 'minute') {
      const num = parseInt(value);
      if (value === '' || (num >= 0 && num <= 59)) {
        setTimeInput({ ...timeInput, minute: value.padStart(2, '0') });
      }
    } else if (field === 'ampm') {
      setTimeInput({ ...timeInput, ampm: value as 'AM' | 'PM' });
    } else {
      setTimeInput({ ...timeInput, [field]: value });
    }
  };

  const calculateTimeLeft = (targetDate: string) => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<{ [key: string]: ReturnType<typeof calculateTimeLeft> }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: string]: ReturnType<typeof calculateTimeLeft> } = {};
      timers.forEach(timer => {
        newTimeLeft[timer.id] = calculateTimeLeft(timer.targetDate);
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [timers]);

  const formatTimeLeft = (timer: Timer) => {
    const time = timeLeft[timer.id] || calculateTimeLeft(timer.targetDate);
    const isExpired = new Date(timer.targetDate).getTime() <= new Date().getTime();

    if (isExpired) {
      return <span className="text-red-600 font-semibold">Event has passed</span>;
    }

    return (
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-2xl font-bold">{time.days}</div>
          <div className="text-sm text-gray-500">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{time.hours}</div>
          <div className="text-sm text-gray-500">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{time.minutes}</div>
          <div className="text-sm text-gray-500">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{time.seconds}</div>
          <div className="text-sm text-gray-500">Seconds</div>
        </div>
      </div>
    );
  };

  const generateStudySchedule = () => {
    if (!selectedTimer || !studyQuestionnaire.totalHours) return;

    const sessions: StudySession[] = [];
    const startDate = new Date();
    const endDate = new Date(selectedTimer.targetDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const availableDays = totalDays - (studyQuestionnaire.avoidWeekends ? Math.floor(totalDays / 7) * 2 : 0);
    const hoursPerSession = studyQuestionnaire.totalHours / availableDays;

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      if (!studyQuestionnaire.avoidWeekends || (currentDate.getDay() !== 0 && currentDate.getDay() !== 6)) {
        const session: StudySession = {
          id: Date.now().toString(),
          date: currentDate.toISOString().split('T')[0],
          startTime: '',
          endTime: '',
          hours: hoursPerSession,
          completed: false,
        };

        // Set time based on preference
        switch (studyQuestionnaire.preferredTime) {
          case 'morning':
            session.startTime = `${currentDate.toISOString().split('T')[0]}T09:00:00`;
            session.endTime = `${currentDate.toISOString().split('T')[0]}T12:00:00`;
            break;
          case 'afternoon':
            session.startTime = `${currentDate.toISOString().split('T')[0]}T13:00:00`;
            session.endTime = `${currentDate.toISOString().split('T')[0]}T17:00:00`;
            break;
          case 'evening':
            session.startTime = `${currentDate.toISOString().split('T')[0]}T18:00:00`;
            session.endTime = `${currentDate.toISOString().split('T')[0]}T21:00:00`;
            break;
        }

        sessions.push(session);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setTimers(timers.map(timer => 
      timer.id === selectedTimer.id 
        ? { ...timer, studySchedule: { ...studyQuestionnaire, sessions } }
        : timer
    ));

    setShowQuestionnaire(false);
    setStudyQuestionnaire({
      totalHours: 0,
      frequency: 'daily',
      preferredTime: 'morning',
      avoidWeekends: true,
    });
  };

  const getCalendarEvents = () => {
    const events: Array<{
      id: string;
      title: string;
      start: string;
      end?: string;
      allDay?: boolean;
      backgroundColor: string;
      borderColor: string;
      textColor: string;
      classNames: string[];
    }> = [];

    timers.forEach(timer => {
      // Add main event
      events.push({
        id: timer.id,
        title: timer.name,
        start: timer.targetDate,
        allDay: false,
        backgroundColor: timer.type === 'exam' ? '#fecaca' : timer.type === 'competition' ? '#bfdbfe' : '#bbf7d0',
        borderColor: timer.type === 'exam' ? '#f87171' : timer.type === 'competition' ? '#60a5fa' : '#4ade80',
        textColor: timer.type === 'exam' ? '#991b1b' : timer.type === 'competition' ? '#1e40af' : '#166534',
        classNames: ['font-medium', 'shadow-sm', 'rounded-lg', 'px-2', 'py-1'],
      });

      // Add study sessions
      timer.studySchedule?.sessions.forEach(session => {
        events.push({
          id: session.id,
          title: `Study: ${timer.name} (${session.hours}h)`,
          start: session.startTime,
          end: session.endTime,
          backgroundColor: timer.type === 'exam' ? '#fee2e2' : '#dbeafe',
          borderColor: timer.type === 'exam' ? '#fecaca' : '#bfdbfe',
          textColor: timer.type === 'exam' ? '#991b1b' : '#1e40af',
          classNames: ['text-sm', 'shadow-sm', 'rounded-lg', 'px-2', 'py-1'],
        });
      });
    });

    return events;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Countdown Timer
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track important dates and prepare for your upcoming events
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Event Calendar
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-300 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Exam</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Competition</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-300 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Other</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-300 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Study Session</span>
              </div>
            </div>
          </div>
          <div className="h-[600px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={getCalendarEvents()}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="100%"
              dayMaxEvents={true}
              eventDisplay="block"
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              eventClassNames="hover:shadow-md transition-shadow duration-200"
              dayCellClassNames="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm rounded-lg"
              moreLinkText="+%d more"
              moreLinkClassNames="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week'
              }}
              buttonIcons={{
                prev: 'chevron-left',
                next: 'chevron-right'
              }}
              themeSystem="standard"
              dayHeaderClassNames="text-sm font-medium text-gray-600 dark:text-gray-300"
              weekNumberClassNames="text-sm text-gray-500 dark:text-gray-400"
              allDayClassNames="bg-emerald-50 dark:bg-emerald-900/20"
              eventClick={(info) => {
                const timer = timers.find(t => t.id === info.event.id);
                if (timer) {
                  setSelectedTimer(timer);
                }
              }}
              dayCellContent={(arg) => {
                return (
                  <div className="flex items-center justify-center w-full h-full rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    {arg.dayNumberText}
                  </div>
                );
              }}
            />
          </div>
        </div>

        {/* Add Timer Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Add New Event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Name</label>
              <input
                type="text"
                value={newTimer.name}
                onChange={(e) => setNewTimer({ ...newTimer, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter event name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
              <select
                value={newTimer.type}
                onChange={(e) => setNewTimer({ ...newTimer, type: e.target.value as Timer['type'] })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="exam">Exam</option>
                <option value="competition">Competition</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                value={timeInput.date}
                onChange={(e) => handleTimeChange('date', e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hour</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={timeInput.hour}
                  onChange={(e) => handleTimeChange('hour', e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minute</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timeInput.minute}
                  onChange={(e) => handleTimeChange('minute', e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">AM/PM</label>
                <select
                  value={timeInput.ampm}
                  onChange={(e) => handleTimeChange('ampm', e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={addTimer}
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>

        {/* Timers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timers.map((timer) => (
            <div
              key={timer.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{timer.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    timer.type === 'exam' 
                      ? 'bg-red-100 text-red-800' 
                      : timer.type === 'competition'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {timer.type}
                  </span>
                </div>
                <button
                  onClick={() => deleteTimer(timer.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {formatTimeLeft(timer)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(timer.targetDate).toLocaleDateString()} at{' '}
                  {new Date(timer.targetDate).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Study Schedule Questionnaire Modal */}
        {showQuestionnaire && selectedTimer && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-xl relative z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Study Schedule Questionnaire
                </h2>
                <button
                  onClick={() => {
                    setShowQuestionnaire(false);
                    setStudyQuestionnaire({
                      totalHours: 0,
                      frequency: 'daily',
                      preferredTime: 'morning',
                      avoidWeekends: true,
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Study Hours Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={studyQuestionnaire.totalHours}
                    onChange={(e) => setStudyQuestionnaire({
                      ...studyQuestionnaire,
                      totalHours: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Study Frequency
                  </label>
                  <select
                    value={studyQuestionnaire.frequency}
                    onChange={(e) => setStudyQuestionnaire({
                      ...studyQuestionnaire,
                      frequency: e.target.value as StudyQuestionnaire['frequency']
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="every_other_day">Every Other Day</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Study Time
                  </label>
                  <select
                    value={studyQuestionnaire.preferredTime}
                    onChange={(e) => setStudyQuestionnaire({
                      ...studyQuestionnaire,
                      preferredTime: e.target.value as StudyQuestionnaire['preferredTime']
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                    <option value="evening">Evening (6 PM - 9 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={studyQuestionnaire.avoidWeekends}
                      onChange={(e) => setStudyQuestionnaire({
                        ...studyQuestionnaire,
                        avoidWeekends: e.target.checked
                      })}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Avoid scheduling study sessions on weekends
                    </span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => {
                      setShowQuestionnaire(false);
                      setStudyQuestionnaire({
                        totalHours: 0,
                        frequency: 'daily',
                        preferredTime: 'morning',
                        avoidWeekends: true,
                      });
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Skip
                  </button>
                  <button
                    onClick={generateStudySchedule}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Generate Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
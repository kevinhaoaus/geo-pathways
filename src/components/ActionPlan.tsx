import { useState } from 'react';
import { CheckCircleIcon, CalendarDaysIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface ActionPlanProps {
  pathwayMatches: any[]; // Simplified for now
  studentYear: number; // Year 10, 11, 12
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  timeframe: 'immediate' | 'this_term' | 'this_year' | 'year_12' | 'post_school';
  category: 'subjects' | 'experience' | 'skills' | 'exploration' | 'preparation';
  difficulty: 'easy' | 'medium' | 'challenging';
  completed?: boolean;
}

const actionItemsByYear = {
  10: [
    {
      id: 'subjects_earth_science',
      title: 'Choose Earth Science or Geography',
      description: 'Pick Earth Science or Geography for Years 11-12 if available at your school',
      timeframe: 'this_year',
      category: 'subjects',
      difficulty: 'easy'
    },
    {
      id: 'subjects_methods',
      title: 'Plan for Mathematical Methods',
      description: 'Most Earth Science uni courses need Methods - talk to your maths teacher about pathways',
      timeframe: 'this_year', 
      category: 'subjects',
      difficulty: 'medium'
    },
    {
      id: 'experience_museum',
      title: 'Visit a Natural History Museum',
      description: 'Check out Melbourne Museum, Australian Museum, or SA Museum - see geology and climate exhibits',
      timeframe: 'this_term',
      category: 'experience', 
      difficulty: 'easy'
    },
    {
      id: 'skills_coding_intro',
      title: 'Try coding with Codecademy or Khan Academy', 
      description: 'Start with Python basics - it\'s the most used language in Earth Science',
      timeframe: 'this_year',
      category: 'skills',
      difficulty: 'medium'
    }
  ],
  11: [
    {
      id: 'subjects_physics_chem',
      title: 'Consider Physics and Chemistry',
      description: 'These open up more uni course options and look great on applications',
      timeframe: 'immediate',
      category: 'subjects',
      difficulty: 'challenging'
    },
    {
      id: 'experience_work_experience',
      title: 'Apply for work experience',
      description: 'Contact local councils, CSIRO, Bureau of Meteorology, or environmental consultants',
      timeframe: 'this_term',
      category: 'experience',
      difficulty: 'medium'
    },
    {
      id: 'exploration_uni_programs',
      title: 'Research university programs',
      description: 'Look at Environmental Science, Geology, and Earth Science programs at different unis',
      timeframe: 'this_year',
      category: 'exploration',
      difficulty: 'easy'
    },
    {
      id: 'skills_gis_intro',
      title: 'Learn basic GIS skills',
      description: 'Try QGIS (free) or take an online course - GIS is used in almost every Earth Science job',
      timeframe: 'this_year', 
      category: 'skills',
      difficulty: 'medium'
    }
  ],
  12: [
    {
      id: 'preparation_uni_applications',
      title: 'Submit university applications',
      description: 'Apply through UAC, VTAC, or your state system - include backup options',
      timeframe: 'immediate',
      category: 'preparation',
      difficulty: 'medium'
    },
    {
      id: 'experience_volunteer',
      title: 'Volunteer with environmental groups',
      description: 'Join local Landcare, conservation groups, or citizen science projects',
      timeframe: 'this_year',
      category: 'experience', 
      difficulty: 'easy'
    },
    {
      id: 'preparation_scholarships',
      title: 'Apply for scholarships',
      description: 'Look for STEM scholarships, environmental scholarships, and general merit scholarships',
      timeframe: 'this_term',
      category: 'preparation',
      difficulty: 'medium'
    },
    {
      id: 'skills_portfolio',
      title: 'Build a portfolio',
      description: 'Document your projects, work experience, and volunteer work for uni interviews',
      timeframe: 'this_year',
      category: 'skills',
      difficulty: 'easy'
    }
  ]
};

export default function ActionPlan({ pathwayMatches, studentYear }: ActionPlanProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('immediate');

  const currentYearActions = actionItemsByYear[studentYear as keyof typeof actionItemsByYear] || actionItemsByYear[12];
  
  const toggleCompleted = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const getCategoryIcon = (category: ActionItem['category']) => {
    switch (category) {
      case 'subjects': return AcademicCapIcon;
      case 'experience': return BriefcaseIcon;
      case 'skills': return AcademicCapIcon;
      case 'exploration': return CalendarDaysIcon;
      case 'preparation': return CheckCircleIcon;
      default: return CheckCircleIcon;
    }
  };

  const getCategoryColor = (category: ActionItem['category']) => {
    switch (category) {
      case 'subjects': return 'bg-blue-100 text-blue-800';
      case 'experience': return 'bg-green-100 text-green-800';
      case 'skills': return 'bg-purple-100 text-purple-800';
      case 'exploration': return 'bg-orange-100 text-orange-800';
      case 'preparation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyEmoji = (difficulty: ActionItem['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';  
      case 'challenging': return '🔴';
      default: return '🟢';
    }
  };

  const timeframeOptions = [
    { value: 'immediate', label: 'Do This Week', emoji: '⚡' },
    { value: 'this_term', label: 'This Term', emoji: '📅' },
    { value: 'this_year', label: 'This Year', emoji: '🎯' },
    { value: 'year_12', label: 'Year 12', emoji: '🎓' },
    { value: 'post_school', label: 'After School', emoji: '🚀' }
  ];

  const filteredActions = currentYearActions.filter(action => 
    selectedTimeframe === 'all' || action.timeframe === selectedTimeframe
  );

  const completionRate = Math.round((completedItems.size / currentYearActions.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Your Earth Science Action Plan
        </h2>
        <p className="text-gray-600">
          Simple steps to get you started on your Earth Science journey
        </p>
        
        {/* Progress */}
        <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedItems.size} of {currentYearActions.length} actions completed ({completionRate}%)
        </p>
      </div>

      {/* Timeframe Filters */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={() => setSelectedTimeframe('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTimeframe === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Actions
        </button>
        {timeframeOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSelectedTimeframe(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTimeframe === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.emoji} {option.label}
          </button>
        ))}
      </div>

      {/* Action Items */}
      <div className="space-y-4">
        {filteredActions.map((action, index) => {
          const isCompleted = completedItems.has(action.id);
          const Icon = getCategoryIcon(action.category);
          
          return (
            <div
              key={action.id}
              className={`
                border rounded-lg p-4 transition-all duration-200
                ${isCompleted 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
                }
                animate-slide-in-right
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleCompleted(action.id)}
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isCompleted
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 hover:border-primary-500'
                    }
                  `}
                >
                  {isCompleted && (
                    <CheckCircleIconSolid className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-semibold ${isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                      {action.title}
                    </h3>
                    <span className="text-lg">{getDifficultyEmoji(action.difficulty)}</span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(action.category)}`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {action.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement */}
      {completionRate > 50 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
          <div className="text-center">
            <p className="text-green-800 font-medium">
              🌟 You're making great progress! Keep it up!
            </p>
            <p className="text-green-700 text-sm mt-1">
              You're well on your way to an amazing Earth Science career.
            </p>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-6 text-center">
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors">
          📧 Email This Plan to Myself
        </button>
      </div>
    </div>
  );
}
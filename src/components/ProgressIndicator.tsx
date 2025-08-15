import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  progress: number;
  category?: string;
  showCategory?: boolean;
  estimatedTimeRemaining?: number;
}

export default function ProgressIndicator({
  current,
  total,
  progress,
  category,
  showCategory = false,
  estimatedTimeRemaining
}: ProgressIndicatorProps) {
  const getProgressColor = () => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return '< 1 min';
    if (minutes === 1) return '1 min';
    return `${Math.round(minutes)} mins`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Assessment Progress
            </h3>
            {showCategory && category && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {category}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">{current}</span>
            <span className="mx-1">/</span>
            <span>{total}</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className={`progress-fill ${getProgressColor()}`}
            style={{ width: `${Math.max(progress, 0)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>{Math.round(progress)}% complete</span>
          {estimatedTimeRemaining && (
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>{formatTime(estimatedTimeRemaining)} remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Section Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Interests', id: 'holland-code', questions: 40 },
          { name: 'Identity', id: 'science-identity', questions: 16 },
          { name: 'Skills', id: 'self-efficacy', questions: 24 },
          { name: 'Values', id: 'values', questions: 25 }
        ].map((section) => {
          const sectionProgress = calculateSectionProgress(section.id, current, total);
          const isComplete = sectionProgress >= 100;
          const isCurrent = category?.toLowerCase().includes(section.name.toLowerCase());

          return (
            <div
              key={section.id}
              className={`
                p-3 rounded-lg border transition-all duration-200
                ${isCurrent 
                  ? 'border-primary-200 bg-primary-50' 
                  : isComplete 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span 
                  className={`
                    text-sm font-medium
                    ${isCurrent 
                      ? 'text-primary-700' 
                      : isComplete 
                      ? 'text-green-700' 
                      : 'text-gray-600'
                    }
                  `}
                >
                  {section.name}
                </span>
                {isComplete && (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <div className="w-full bg-white rounded-full h-1.5">
                <div 
                  className={`
                    h-full rounded-full transition-all duration-300
                    ${isCurrent 
                      ? 'bg-primary-500' 
                      : isComplete 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                    }
                  `}
                  style={{ width: `${Math.min(sectionProgress, 100)}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(sectionProgress)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Messages */}
      {progress > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            {getMotivationalMessage(progress)}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper functions
function calculateSectionProgress(sectionId: string, current: number, total: number): number {
  // This is a simplified calculation - in a real implementation,
  // you would track which questions belong to which section
  const sectionWeights = {
    'holland-code': 0.4,
    'science-identity': 0.15,
    'self-efficacy': 0.25,
    'values': 0.2
  };

  const sectionWeight = sectionWeights[sectionId as keyof typeof sectionWeights] || 0.25;
  const overallProgress = current / total;
  
  // Simplified: assume sections are completed in order
  const sectionStart = Object.keys(sectionWeights).indexOf(sectionId) * 0.25;
  const sectionEnd = sectionStart + sectionWeight;
  
  if (overallProgress <= sectionStart) return 0;
  if (overallProgress >= sectionEnd) return 100;
  
  return ((overallProgress - sectionStart) / sectionWeight) * 100;
}

function getMotivationalMessage(progress: number): string {
  if (progress < 15) {
    return "Great start! You're beginning to build your Earth Science career profile.";
  } else if (progress < 35) {
    return "Nice progress! We're learning about your interests and preferences.";
  } else if (progress < 60) {
    return "You're doing great! We're halfway to discovering your ideal career path.";
  } else if (progress < 85) {
    return "Almost there! Your career recommendations are taking shape.";
  } else {
    return "Excellent work! Just a few more questions to complete your assessment.";
  }
}
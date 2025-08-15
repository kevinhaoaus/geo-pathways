import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Question, AssessmentResponse } from '@/types';

interface QuestionScreenProps {
  question: Question;
  currentResponse?: number;
  onResponse: (response: AssessmentResponse) => void;
  onPrevious?: () => void;
  isFirst: boolean;
  isLast: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionScreen({
  question,
  currentResponse,
  onResponse,
  onPrevious,
  isFirst,
  isLast,
  questionNumber,
  totalQuestions
}: QuestionScreenProps) {
  const [selectedValue, setSelectedValue] = useState<number | undefined>(currentResponse);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form state when question changes
  useEffect(() => {
    setSelectedValue(currentResponse);
    setIsSubmitting(false);
    setIsAnimating(false);
  }, [question.id, currentResponse]);

  const handleOptionSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleNext = () => {
    if (selectedValue === undefined || isSubmitting) return;

    setIsSubmitting(true);

    const response: AssessmentResponse = {
      questionId: question.id,
      value: selectedValue,
      timestamp: new Date()
    };

    // Call onResponse immediately without delay to prevent flashing
    onResponse(response);
  };

  const getQuestionTypeDescription = () => {
    switch (question.type) {
      case 'likert_5':
        return 'Rate your agreement or preference';
      case 'multiple_choice':
        return 'Select the best answer';
      case 'ranking':
        return 'Rank in order of preference';
      case 'binary':
        return 'Choose yes or no';
      default:
        return 'Select your response';
    }
  };

  const getSubcategoryDisplay = () => {
    const subcategoryLabels = {
      'realistic': 'Hands-on & Practical',
      'investigative': 'Research & Analysis', 
      'artistic': 'Creative & Expressive',
      'social': 'People & Community',
      'enterprising': 'Leadership & Business',
      'conventional': 'Organized & Systematic',
      'exploration': 'Career Exploration',
      'commitment': 'Science Commitment',
      'values': 'What Matters to You'
    };
    
    return subcategoryLabels[question.subcategory as keyof typeof subcategoryLabels] || 
           question.subcategory.replace('_', ' ');
  };

  const renderResponseOptions = () => {
    if (question.type === 'likert_5') {
      return (
        <div className="space-y-3">
          {question.responseOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`
                response-option
                ${selectedValue === option.value ? 'selected' : ''}
                animate-fade-in-up
              `}
              style={{ animationDelay: `${option.value * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className={`
                      w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                      ${selectedValue === option.value 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-gray-300'
                      }
                    `}
                  >
                    {selectedValue === option.value && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-left">{option.label}</span>
                </div>
                <span className="text-sm text-gray-400 font-medium">
                  {option.value}
                </span>
              </div>
            </button>
          ))}
        </div>
      );
    }

    // For other question types (multiple choice, etc.)
    return (
      <div className="space-y-3">
        {question.responseOptions.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleOptionSelect(option.value)}
            className={`
              response-option
              ${selectedValue === option.value ? 'selected' : ''}
              animate-fade-in-up
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div 
                className={`
                  w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                  ${selectedValue === option.value 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-300'
                  }
                `}
              >
                {selectedValue === option.value && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-left">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`question-container ${isAnimating ? 'animate-scale-in' : 'animate-fade-in-up'}`}>
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
          <span>{getSubcategoryDisplay()}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-2">
          {getQuestionTypeDescription()}
        </div>
      </div>

      {/* Question Text */}
      <div className="text-center mb-12">
        <h2 className="question-text">
          {question.text}
        </h2>
        
        {question.researchSource && (
          <details className="mt-4 text-left max-w-2xl mx-auto">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
              Research Background
            </summary>
            <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-gray-200">
              {question.researchSource}
            </p>
          </details>
        )}
      </div>

      {/* Response Options */}
      <div className="mb-12 max-w-2xl mx-auto">
        {renderResponseOptions()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <div>
          {!isFirst && onPrevious && (
            <button
              onClick={onPrevious}
              className="btn-secondary flex items-center"
              disabled={isAnimating}
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Previous
            </button>
          )}
        </div>

        <div className="text-center flex-1">
          <div className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>

        <div>
          <button
            onClick={handleNext}
            disabled={selectedValue === undefined || isAnimating || isSubmitting}
            className={`
              btn-primary flex items-center
              ${selectedValue === undefined || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              ${isAnimating ? 'animate-pulse' : ''}
            `}
          >
            {isSubmitting ? (
              <>
                Submitting...
                <div className="w-4 h-4 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : isLast ? (
              <>
                Complete Assessment
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Skip Option (for optional questions) */}
      {question.weight < 1.0 && (
        <div className="text-center mt-4">
          <button
            onClick={() => handleOptionSelect(-1)} // Use -1 to indicate skip
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
            disabled={isAnimating}
          >
            Skip this question (optional)
          </button>
        </div>
      )}

      {/* Question Progress Indicator */}
      <div className="mt-8 text-center">
        <div className="inline-flex space-x-1">
          {Array.from({ length: Math.min(totalQuestions, 20) }).map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-colors duration-200
                ${index < questionNumber - 1
                  ? 'bg-green-400'
                  : index === questionNumber - 1
                  ? 'bg-primary-500'
                  : 'bg-gray-200'
                }
              `}
            />
          ))}
          {totalQuestions > 20 && (
            <span className="text-xs text-gray-500 ml-2">
              +{totalQuestions - 20} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
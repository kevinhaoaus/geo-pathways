import { useState } from 'react';
import { PlayIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import type { CareerScenario, AssessmentResponse } from '@/types';

interface InteractiveScenarioProps {
  scenario: CareerScenario;
  onResponse: (response: AssessmentResponse) => void;
  questionId: string;
}

export default function InteractiveScenario({ scenario, onResponse, questionId }: InteractiveScenarioProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const choices = [
    { id: 1, text: "This sounds exciting! I'd love to try this.", value: 5 },
    { id: 2, text: "Interesting, I'd like to learn more.", value: 4 },
    { id: 3, text: "It's okay, but not really my thing.", value: 2 },
    { id: 4, text: "Not for me at all.", value: 1 }
  ];

  const handleChoice = (choice: { id: number; value: number }) => {
    setSelectedChoice(choice.id);
    setTimeout(() => {
      setShowResult(true);
      onResponse({
        questionId,
        value: choice.value,
        timestamp: new Date()
      });
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6">
        <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
        <p className="text-blue-100">A Day in the Life</p>
      </div>

      {/* Scenario Content */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Imagine this is your workday:</h4>
          <p className="text-gray-700 mb-4">{scenario.description}</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Today you'll be:</h5>
            <ul className="space-y-1">
              {scenario.tasks.slice(0, 3).map((task, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* Multimedia content if available */}
          {scenario.multimedia && scenario.multimedia[0] && (
            <div className="mb-4">
              <div className="relative bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <PlayIcon className="w-12 h-12 text-gray-400" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {scenario.multimedia[0].type === 'video' ? 'Video' : 'Image'}: {scenario.multimedia[0].alt}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Response Choices */}
        {!showResult && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 mb-3">How does this sound to you?</h4>
            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                disabled={selectedChoice !== null}
                className={`
                  w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                  ${selectedChoice === choice.id
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : selectedChoice === null
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                    ${selectedChoice === choice.id ? 'border-green-500 bg-green-500' : 'border-gray-300'}
                  `}>
                    {selectedChoice === choice.id && (
                      <CheckCircleIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-medium">{choice.text}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Result */}
        {showResult && (
          <div className="bg-blue-50 rounded-lg p-4 animate-fade-in">
            <h4 className="font-medium text-blue-900 mb-2">Good to know!</h4>
            <p className="text-blue-800 text-sm">
              This helps us understand what kind of work environment and activities appeal to you. 
              We'll use this to find Earth Science careers that match your interests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  StarIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { AssessmentResults } from '@/types';

interface ResultsScreenProps {
  results: AssessmentResults;
  onRetake: () => void;
}

export default function ResultsScreen({ results, onRetake }: ResultsScreenProps) {
  const [showAllMatches, setShowAllMatches] = useState(false);

  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const displayedMatches = showAllMatches 
    ? results.pathwayMatches 
    : results.pathwayMatches.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <AcademicCapIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Earth Science Career Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your responses, here are your personalized career pathway recommendations
          </p>
        </div>

        {/* Overall Confidence Score */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Overall Match Confidence</h2>
              <p className="text-gray-600">How well your profile aligns with Earth Science careers</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {Math.round(results.confidenceScore * 100)}%
              </div>
              <div className="text-sm text-gray-500">Confidence Level</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${results.confidenceScore * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Top Career Matches */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Top Career Matches</h2>
            <ChartBarIcon className="w-6 h-6 text-primary-600" />
          </div>

          <div className="space-y-4">
            {displayedMatches.map((match, index) => (
              <div 
                key={match.pathway.pathway_id || index}
                className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-md ${getConfidenceColor(match.confidenceLevel)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {match.pathway.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(match.confidenceLevel)}`}>
                        {match.confidenceLevel} Match
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {match.pathway.overview || 'Explore opportunities in this exciting Earth Science field.'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(match.matchScore * 5) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {Math.round(match.matchScore * 100)}% match
                    </div>
                  </div>
                </div>

                {/* Reasons for Match */}
                {match.reasonsForMatch && match.reasonsForMatch.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Why this matches you:</h4>
                    <ul className="space-y-1">
                      {match.reasonsForMatch.slice(0, 3).map((reason, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Considerations */}
                {match.considerations && match.considerations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1 text-yellow-500" />
                      Things to consider:
                    </h4>
                    <ul className="space-y-1">
                      {match.considerations.slice(0, 2).map((consideration, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {results.pathwayMatches.length > 5 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllMatches(!showAllMatches)}
                className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {showAllMatches ? 'Show Less' : `Show ${results.pathwayMatches.length - 5} More Matches`}
                <ArrowDownIcon className={`w-4 h-4 ml-2 transition-transform ${showAllMatches ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Holland Code Profile Summary */}
        {results.hollandProfile && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Interest Profile (Holland Code)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(results.hollandProfile.scores).map(([code, score]) => {
                const hollandLabels: { [key: string]: string } = {
                  'R': 'Realistic',
                  'I': 'Investigative', 
                  'A': 'Artistic',
                  'S': 'Social',
                  'E': 'Enterprising',
                  'C': 'Conventional'
                };
                
                return (
                  <div key={code} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">{code}</div>
                    <div className="text-sm font-medium text-gray-900">{hollandLabels[code]}</div>
                    <div className="text-sm text-gray-600">{Math.round(score * 100)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Next Steps & Recommendations</h2>
            <div className="space-y-4">
              {results.recommendations.slice(0, 5).map((rec, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  <p className="text-gray-600 text-sm">{rec.description}</p>
                  {rec.type && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                      {rec.type.replace('_', ' ')} Action
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={onRetake}
            className="btn-secondary mr-4"
          >
            Retake Assessment
          </button>
          
          <div className="text-sm text-gray-500">
            <p>Want to explore more? Consider speaking with a career counselor about these results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
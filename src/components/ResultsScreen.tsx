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

  const getPathwayImageUrl = (pathway: any) => {
    if (pathway.image) {
      // If image starts with http/https, use as-is (for external URLs)
      if (pathway.image.startsWith('http')) {
        return pathway.image;
      }
      // Otherwise, assume it's a local file in the images/pathways directory
      return `/images/pathways/${pathway.image}`;
    }
    // Fallback: try to find image based on pathway_id
    return `/images/pathways/${pathway.pathway_id}.jpg`;
  };

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

  const getMatchBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const displayedMatches = showAllMatches 
    ? results.pathwayMatches 
    : results.pathwayMatches.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="w-7 h-7 text-primary-600 mr-3" />
              Your Top Career Matches
            </h2>
          </div>

          <div className="space-y-6">
            {displayedMatches.map((match, index) => (
              <div 
                key={match.pathway.pathway_id || index}
                className="border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary-300 bg-white"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Pathway Image */}
                  <div className="lg:w-1/3 h-48 lg:h-auto relative">
                    <img
                      src={getPathwayImageUrl(match.pathway)}
                      alt={match.pathway.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a default image if the pathway image fails to load
                        e.currentTarget.src = '/images/pathways/default-pathway.svg';
                        e.currentTarget.onerror = null; // Prevent infinite loop
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${getMatchBadgeColor(match.confidenceLevel)}`}>
                        {match.confidenceLevel} Match
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {match.pathway.title}
                          </h3>
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
                            <div className="text-lg font-bold text-primary-600 mt-1">
                              {Math.round(match.matchScore * 100)}% match
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                          {match.pathway.overview || 'Explore opportunities in this exciting Earth Science field.'}
                        </p>
                      </div>
                    </div>

                    {/* Reasons for Match */}
                    {match.reasonsForMatch && match.reasonsForMatch.length > 0 && (
                      <div className="mb-4 bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                          <span className="text-green-600 mr-2">✓</span>
                          Why this matches you:
                        </h4>
                        <ul className="space-y-2">
                          {match.reasonsForMatch.slice(0, 3).map((reason, i) => (
                            <li key={i} className="text-green-800 flex items-start">
                              <span className="text-green-500 mr-2 mt-1">•</span>
                              <span className="font-medium">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Considerations */}
                    {match.considerations && match.considerations.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                          <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-600" />
                          Things to consider:
                        </h4>
                        <ul className="space-y-2">
                          {match.considerations.slice(0, 2).map((consideration, i) => (
                            <li key={i} className="text-yellow-800 flex items-start">
                              <span className="text-yellow-500 mr-2 mt-1">•</span>
                              <span className="font-medium">{consideration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {results.pathwayMatches.length > 5 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllMatches(!showAllMatches)}
                className="inline-flex items-center px-6 py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 hover:text-primary-800 font-semibold rounded-lg border border-primary-200 transition-all duration-200"
              >
                {showAllMatches ? 'Show Less' : `Show ${results.pathwayMatches.length - 5} More Matches`}
                <ArrowDownIcon className={`w-5 h-5 ml-2 transition-transform ${showAllMatches ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Holland Code Profile Summary */}
        {results.hollandProfile && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Interest Profile (Holland Code)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                  <div key={code} className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                    <div className="text-3xl font-bold text-primary-700 mb-2">{code}</div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">{hollandLabels[code]}</div>
                    <div className="text-primary-600 font-medium">{Math.round(score * 100)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Next Steps & Recommendations</h2>
            <div className="space-y-4">
              {results.recommendations.slice(0, 5).map((rec, index) => (
                <div key={index} className="border-l-4 border-primary-500 bg-primary-50 rounded-r-lg pl-6 py-4">
                  <h3 className="font-semibold text-gray-900 text-lg">{rec.title}</h3>
                  <p className="text-gray-700 mt-1">{rec.description}</p>
                  {rec.type && (
                    <span className="inline-block mt-3 px-3 py-1 text-sm font-medium bg-primary-200 text-primary-800 rounded-full">
                      {rec.type.replace('_', ' ')} Action
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-6">
          <button
            onClick={onRetake}
            className="btn-secondary"
          >
            Retake Assessment
          </button>
          
          <div className="text-gray-500">
            <p>Want to explore more? Consider speaking with a career counselor about these results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
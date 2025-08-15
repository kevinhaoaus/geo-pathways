import { useState } from 'react';
import { CheckCircleIcon, ClockIcon, AcademicCapIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface WelcomeScreenProps {
  onStart: () => void;
  totalQuestions: number;
  estimatedTime: number;
}

export default function WelcomeScreen({ onStart, totalQuestions, estimatedTime }: WelcomeScreenProps) {
  const [hasConsented, setHasConsented] = useState(false);

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Scientifically Validated',
      description: 'Based on Holland Code theory and validated career assessment research'
    },
    {
      icon: ChartBarIcon,
      title: 'Multi-Dimensional Analysis',
      description: 'Evaluates interests, values, self-efficacy, and science identity'
    },
    {
      icon: CheckCircleIcon,
      title: 'Personalized Results',
      description: 'Get detailed career recommendations with educational pathways'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
          <AcademicCapIcon className="w-10 h-10 text-primary-600" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 text-balance">
          Discover Your Earth Science Career Path
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Take our scientifically-backed assessment to explore career opportunities in Earth Sciences. 
          From traditional geology to emerging climate technology, find the path that matches your 
          interests, skills, and values.
        </p>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>{estimatedTime} minutes</span>
          </div>
          <div className="flex items-center">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            <span>{totalQuestions} questions</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
              <feature.icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Assessment Preview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          What You'll Explore
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Dimensions</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Interest Profile</span>
                  <p className="text-sm text-gray-600">Holland Code assessment tailored for Earth Sciences</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Science Identity</span>
                  <p className="text-sm text-gray-600">How you see yourself as a scientist and researcher</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Self-Efficacy</span>
                  <p className="text-sm text-gray-600">Confidence in Earth Science skills and abilities</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Career Values</span>
                  <p className="text-sm text-gray-600">What matters most to you in a career</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Career Pathways</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-900">Traditional Fields</span>
                <p className="text-blue-700">Geology, Environmental Science, Meteorology, Oceanography</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-900">Emerging Areas</span>
                <p className="text-green-700">Climate Data Science, Renewable Energy, Risk Assessment</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-900">Interdisciplinary</span>
                <p className="text-purple-700">Environmental Data Science, Geospatial Technology</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy and Consent */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Data Use</h3>
        
        <div className="text-sm text-gray-600 mb-4 space-y-2">
          <p>
            <strong>Your privacy is important to us.</strong> This assessment:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Does not collect personally identifiable information</li>
            <li>Uses session data only for generating your results</li>
            <li>Aggregates anonymous usage data to improve the assessment</li>
            <li>Does not share individual responses with third parties</li>
          </ul>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="consent"
            checked={hasConsented}
            onChange={(e) => setHasConsented(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            I understand how my data will be used and consent to participate in this assessment.
            I am taking this assessment for educational and career exploration purposes.
          </label>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={onStart}
          disabled={!hasConsented}
          className={`
            btn-primary btn-large
            ${!hasConsented ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}
            transition-all duration-200
          `}
        >
          {hasConsented ? 'Start Assessment' : 'Please Accept Terms to Continue'}
        </button>
        
        {hasConsented && (
          <p className="text-sm text-gray-500 mt-4">
            You can pause and resume the assessment at any time
          </p>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12 p-6 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> This assessment is designed for high school students and early career 
          professionals exploring Earth Science pathways. Results provide guidance and should be 
          considered alongside academic advising and career counseling.
        </p>
      </div>
    </div>
  );
}
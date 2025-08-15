import { useState, useEffect } from 'react';
import { AssessmentEngine } from '@/lib/assessmentEngine';
import QuestionScreen from './QuestionScreen';
import ProgressIndicator from './ProgressIndicator';
import type { 
  Question, 
  CareerPathway, 
  ScoringMatrix, 
  AssessmentResponse, 
  AssessmentResults,
  AssessmentSession
} from '@/types';

interface QuizContainerProps {
  questions: Question[];
  pathways: CareerPathway[];
  scoringMatrix: ScoringMatrix;
  onComplete: (results: AssessmentResults) => void;
}

export default function QuizContainer({ 
  questions, 
  pathways, 
  scoringMatrix, 
  onComplete 
}: QuizContainerProps) {
  const [session, setSession] = useState<AssessmentSession>({
    id: generateSessionId(),
    responses: [],
    currentQuestionIndex: 0,
    startTime: new Date(),
    lastActivity: new Date(),
    completed: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
    questions.length > 0 ? questions[0] : null
  );

  // Load saved session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('earthScienceQuizSession');
    if (savedSession) {
      try {
        const parsed: AssessmentSession = JSON.parse(savedSession);
        // Only restore if session is less than 24 hours old
        const hoursSinceLastActivity = (Date.now() - new Date(parsed.lastActivity).getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastActivity < 24 && !parsed.completed) {
          setSession(parsed);
          setCurrentQuestion(questions[parsed.currentQuestionIndex] || null);
        }
      } catch (error) {
        console.warn('Error restoring quiz session:', error);
      }
    }
  }, [questions]);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session.responses.length > 0) {
      localStorage.setItem('earthScienceQuizSession', JSON.stringify(session));
    }
  }, [session]);

  // Update last activity timestamp periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSession(prev => ({ ...prev, lastActivity: new Date() }));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleResponse = async (response: AssessmentResponse) => {
    const updatedResponses = [
      ...session.responses.filter(r => r.questionId !== response.questionId),
      response
    ];

    const newIndex = session.currentQuestionIndex + 1;
    
    // Check if quiz is complete BEFORE updating session
    if (newIndex >= questions.length) {
      // Complete the assessment
      await completeAssessment(updatedResponses);
    } else {
      // Continue to next question
      const updatedSession: AssessmentSession = {
        ...session,
        responses: updatedResponses,
        currentQuestionIndex: newIndex,
        lastActivity: new Date()
      };

      setSession(updatedSession);
      setCurrentQuestion(questions[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (session.currentQuestionIndex > 0) {
      const newIndex = session.currentQuestionIndex - 1;
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: newIndex,
        lastActivity: new Date()
      }));
      setCurrentQuestion(questions[newIndex]);
    }
  };

  const completeAssessment = async (responses: AssessmentResponse[]) => {
    setIsLoading(true);
    
    try {
      // Calculate results using the assessment engine
      const engine = new AssessmentEngine(questions, pathways, scoringMatrix);
      const results = engine.calculateResults(responses);

      // Mark session as completed
      const completedSession: AssessmentSession = {
        ...session,
        responses,
        completed: true,
        lastActivity: new Date(),
        results
      };

      setSession(completedSession);
      
      // Clear saved session from localStorage
      localStorage.removeItem('earthScienceQuizSession');
      
      // Track completion analytics
      trackAnalyticsEvent('assessment_completed', {
        sessionId: session.id,
        duration: Date.now() - session.startTime.getTime(),
        totalQuestions: questions.length,
        responseCount: responses.length
      });

      // Pass results to parent component
      onComplete(results);

    } catch (error) {
      console.error('Error calculating assessment results:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentResponse = (): number | undefined => {
    if (!currentQuestion) return undefined;
    const response = session.responses.find(r => r.questionId === currentQuestion.id);
    return response?.value;
  };

  const getProgress = (): number => {
    return questions.length > 0 ? (session.currentQuestionIndex / questions.length) * 100 : 0;
  };

  const getQuestionCategory = (question: Question): string => {
    const categoryLabels: { [key: string]: string } = {
      'holland-code': 'Interest Profile',
      'science-identity': 'Science Identity',
      'values': 'Career Values',
      'self-efficacy': 'Skills & Confidence',
      'outcome-expectations': 'Career Expectations'
    };
    return categoryLabels[question.category] || question.category;
  };

  if (!currentQuestion && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No questions available. Please check the content configuration.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="question-container text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-500 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Calculating Your Results...
            </h2>
            <p className="text-gray-600">
              Analyzing your responses and matching with Earth Science career pathways
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <ProgressIndicator
          current={session.currentQuestionIndex + 1}
          total={questions.length}
          progress={getProgress()}
          category={currentQuestion ? getQuestionCategory(currentQuestion) : ''}
          showCategory={true}
        />
      </div>

      {/* Question Screen */}
      {currentQuestion && (
        <QuestionScreen
          question={currentQuestion}
          currentResponse={getCurrentResponse()}
          onResponse={handleResponse}
          onPrevious={session.currentQuestionIndex > 0 ? handlePrevious : undefined}
          isFirst={session.currentQuestionIndex === 0}
          isLast={session.currentQuestionIndex === questions.length - 1}
          questionNumber={session.currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}

      {/* Session Info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 text-sm text-gray-600">
          <span>Session saved automatically • </span>
          <span className="font-medium">
            {session.responses.length} of {questions.length} answered
          </span>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function generateSessionId(): string {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function trackAnalyticsEvent(eventType: string, data: any) {
  // Analytics tracking implementation
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventType, {
      custom_parameter: JSON.stringify(data)
    });
  }
  
  // Console log for development
  console.log('Analytics Event:', eventType, data);
}
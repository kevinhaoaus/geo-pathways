import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import QuizContainer from '@/components/QuizContainer';
import WelcomeScreen from '@/components/WelcomeScreen';
import { AssessmentEngine } from '@/lib/assessmentEngine';
import type { Question, CareerPathway, ScoringMatrix, AssessmentResults } from '@/types';

interface HomeProps {
  questions: Question[];
  pathways: CareerPathway[];
  scoringMatrix: ScoringMatrix;
}

type AppState = 'welcome' | 'quiz' | 'results';

export default function Home({ questions, pathways, scoringMatrix }: HomeProps) {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const handleStartQuiz = () => {
    setAppState('quiz');
  };

  const handleQuizComplete = (assessmentResults: AssessmentResults) => {
    setResults(assessmentResults);
    setAppState('results');
  };

  const handleRetakeQuiz = () => {
    setResults(null);
    setAppState('welcome');
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onStart={handleStartQuiz}
            totalQuestions={questions.length}
            estimatedTime={Math.ceil(questions.length * 0.5)} // 30 seconds per question
          />
        );
      
      case 'quiz':
        return (
          <QuizContainer
            questions={questions}
            pathways={pathways}
            scoringMatrix={scoringMatrix}
            onComplete={handleQuizComplete}
          />
        );
      
      case 'results':
        return results ? (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-center mb-8">Assessment Complete!</h1>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <pre>{JSON.stringify(results, null, 2)}</pre>
                <button 
                  onClick={handleRetakeQuiz}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          </div>
        ) : null;
      
      default:
        return <WelcomeScreen onStart={handleStartQuiz} totalQuestions={questions.length} estimatedTime={15} />;
    }
  };

  return (
    <>
      <Head>
        <title>Earth Science Career Pathways Quiz</title>
        <meta 
          name="description" 
          content="Discover your ideal Earth Science career path with our scientifically-backed assessment. Explore geology, environmental science, climate research, and emerging fields." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Earth Science Career Pathways Quiz" />
        <meta property="og:description" content="Discover your ideal Earth Science career path" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preload critical fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {renderCurrentScreen()}
        </div>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <div className="mb-4 md:mb-0">
                <p>© 2024 Earth Science Career Pathways Quiz</p>
                <p className="text-xs">Based on validated career assessment research</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <a 
                  href="/about" 
                  className="hover:text-primary-600 transition-colors"
                >
                  About This Assessment
                </a>
                <a 
                  href="/methodology" 
                  className="hover:text-primary-600 transition-colors"
                >
                  Methodology
                </a>
                <a 
                  href="/privacy" 
                  className="hover:text-primary-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    // Import compiled content data
    const questionsData = await import('../data/questions.json');
    const pathwaysData = await import('../data/pathways.json');
    const scoringData = await import('../data/scoring-matrix.json');

    // Validate and process the data
    const questions: Question[] = (questionsData.default || []) as unknown as Question[];
    const pathways: CareerPathway[] = (pathwaysData.default || []) as unknown as CareerPathway[];
    const scoringMatrix: ScoringMatrix = (scoringData.default || {
      hollandCodeWeights: { R: 1.1, I: 1.2, A: 1.0, S: 1.05, E: 1.0, C: 1.0 },
      pathwayMatchingWeights: {
        interests: 0.4,
        identity: 0.25,
        selfEfficacy: 0.2,
        values: 0.1,
        knowledge: 0.05
      },
      thresholds: {
        highMatch: 0.75,
        moderateMatch: 0.6,
        minRecommendations: 3,
        maxRecommendations: 8
      }
    }) as unknown as ScoringMatrix;

    // Validate that we have content
    if (questions.length === 0) {
      console.warn('No questions found - check content compilation');
    }
    if (pathways.length === 0) {
      console.warn('No pathways found - check content compilation');
    }

    return {
      props: {
        questions,
        pathways,
        scoringMatrix
      },
      // Revalidate every 24 hours to pick up content updates
      revalidate: 86400
    };
  } catch (error) {
    console.error('Error loading assessment data:', error);
    
    // Return minimal fallback data to prevent build failure
    return {
      props: {
        questions: [],
        pathways: [],
        scoringMatrix: {
          hollandCodeWeights: { R: 1.0, I: 1.0, A: 1.0, S: 1.0, E: 1.0, C: 1.0 },
          pathwayMatchingWeights: {
            interests: 0.4,
            identity: 0.25,
            selfEfficacy: 0.2,
            values: 0.1,
            knowledge: 0.05
          },
          thresholds: {
            highMatch: 0.75,
            moderateMatch: 0.6,
            minRecommendations: 3,
            maxRecommendations: 8
          }
        }
      }
    };
  }
};
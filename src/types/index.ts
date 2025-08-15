// Core assessment types
export interface Question {
  id: string;
  category: QuestionCategory;
  subcategory: string;
  text: string;
  type: QuestionType;
  weight: number;
  researchSource?: string;
  validation?: string;
  responseOptions: ResponseOption[];
  pathwayScoring: Record<string, number>;
  adaptiveLogic?: AdaptiveLogic;
  multimedia?: MultimediaContent;
}

export interface ResponseOption {
  value: number;
  label: string;
}

export type QuestionCategory = 
  | 'holland-code' 
  | 'science-identity' 
  | 'values' 
  | 'self-efficacy'
  | 'outcome-expectations'
  | 'work-environment'
  | 'learning-style'
  | 'career-maturity'
  | 'life-role-salience'
  | 'multiple-intelligence'
  | 'scenario-based';

export type QuestionType = 
  | 'likert_5' 
  | 'likert_7'
  | 'multiple_choice' 
  | 'ranking' 
  | 'binary'
  | 'scenario'
  | 'slider'
  | 'card_sort';

export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

// Enhanced assessment features
export interface AdaptiveLogic {
  conditions: Array<{
    previousQuestionId: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'in_range';
    value: number | number[];
    showIfTrue?: boolean;
  }>;
  alternativeQuestion?: string;
}

export interface MultimediaContent {
  type: 'video' | 'image' | 'audio' | 'infographic';
  url: string;
  alt?: string;
  transcript?: string;
  duration?: number;
}

export interface CareerScenario {
  id: string;
  title: string;
  description: string;
  setting: string;
  tasks: string[];
  challenges: string[];
  rewards: string[];
  typicalDay: string;
  requiredSkills: string[];
  multimedia?: MultimediaContent[];
}

// Social Cognitive Career Theory elements
export interface OutcomeExpectations {
  financial: number;
  personalSatisfaction: number;
  socialImpact: number;
  workLifeBalance: number;
  careerAdvancement: number;
  jobSecurity: number;
  intellectualStimulation: number;
}

export interface EnvironmentalFactors {
  familySupport: number;
  financialResources: number;
  educationalOpportunities: number;
  roleModelAccess: number;
  peerSupport: number;
  communityResources: number;
}

// Multiple Intelligence assessment
export interface MultipleIntelligences {
  spatial: number;           // Important for geology, GIS
  logicalMath: number;       // Critical for data analysis
  naturalist: number;        // Key for earth sciences
  linguistic: number;        // Scientific communication
  kinesthetic: number;       // Fieldwork and lab skills
  interpersonal: number;     // Collaboration and teamwork
  intrapersonal: number;     // Self-reflection and autonomy
  musical: number;           // Pattern recognition
}

// Learning style preferences (Kolb)
export interface LearningStyle {
  concreteExperience: number;      // Hands-on learning
  abstractConceptualization: number; // Theoretical learning
  activeExperimentation: number;    // Trial and error
  reflectiveObservation: number;    // Watching and thinking
}

// Work environment preferences
export interface WorkEnvironment {
  physical: {
    indoor: number;
    outdoor: number;
    laboratory: number;
    office: number;
    field: number;
    remote: number;
  };
  social: {
    teamwork: number;
    independent: number;
    publicInteraction: number;
    mentoring: number;
    leadership: number;
  };
  organizational: {
    structured: number;
    flexible: number;
    hierarchical: number;
    collaborative: number;
    entrepreneurial: number;
  };
}

// Career maturity assessment
export interface CareerMaturity {
  careerPlanning: number;
  careerExploration: number;
  worldOfWorkInfo: number;
  knowledgeOfPreferredGroup: number;
  careerDecisionMaking: number;
}

// Career pathway types
export interface CareerPathway {
  pathway_id: string;
  category: PathwayCategory;
  fileName: string;
  title: string;
  holland_codes?: HollandCode[];
  primary_interests?: string[];
  growth_rate?: number;
  last_updated?: string;
  data_sources?: string[];
  overview: string;
  image?: string; // Optional image filename or URL
  careerProgression?: any;
  education?: any;
  skills?: any;
  outlook?: any;
  content: string;
}

export type PathwayCategory = 'traditional' | 'emerging' | 'interdisciplinary';

// Assessment response and scoring types
export interface AssessmentResponse {
  questionId: string;
  value: number;
  timestamp: Date;
}

export interface AssessmentSession {
  id: string;
  userId?: string;
  responses: AssessmentResponse[];
  currentQuestionIndex: number;
  startTime: Date;
  lastActivity: Date;
  completed: boolean;
  results?: AssessmentResults;
}

export interface AssessmentResults {
  hollandProfile: HollandProfile;
  scienceIdentity: ScienceIdentityProfile;
  selfEfficacy: SelfEfficacyProfile;
  values: ValuesProfile;
  pathwayMatches: PathwayMatch[];
  recommendations: Recommendation[];
  confidenceScore: number;
  // Enhanced assessments (optional for now)
  outcomeExpectations?: OutcomeExpectations;
  environmentalFactors?: EnvironmentalFactors;
  multipleIntelligences?: MultipleIntelligences;
  learningStyle?: LearningStyle;
  workEnvironment?: WorkEnvironment;
  careerMaturity?: CareerMaturity;
  skillsGapAnalysis?: SkillsGapAnalysis;
  peerComparison?: PeerComparison;
}

export interface HollandProfile {
  scores: Record<HollandCode, number>;
  primaryCode: HollandCode;
  secondaryCode?: HollandCode;
  profile: string; // e.g., "RIC"
}

export interface ScienceIdentityProfile {
  exploration: number;
  commitment: number;
  status: 'Achievement' | 'Moratorium' | 'Foreclosure' | 'Diffusion';
  description: string;
}

export interface SelfEfficacyProfile {
  overall: number;
  levels: {
    basic: number;
    applied: number;
    inquiry: number;
    innovation: number;
  };
  strengths: string[];
  developmentAreas: string[];
}

export interface ValuesProfile {
  topValues: Array<{
    name: string;
    score: number;
    description: string;
  }>;
  categories: Record<string, number>;
}

export interface PathwayMatch {
  pathway: CareerPathway;
  matchScore: number;
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  reasonsForMatch: string[];
  considerations: string[];
}

export interface Recommendation {
  type: 'immediate' | 'short_term' | 'long_term';
  category: 'education' | 'experience' | 'skills' | 'exploration';
  title: string;
  description: string;
  actionSteps: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'website' | 'course' | 'program' | 'organization';
  }>;
}

// Scoring configuration types
export interface ScoringMatrix {
  hollandCodeWeights: Record<HollandCode, number>;
  pathwayMatchingWeights: {
    interests: number;
    identity: number;
    selfEfficacy: number;
    values: number;
    knowledge: number;
  };
  thresholds: {
    highMatch: number;
    moderateMatch: number;
    minRecommendations: number;
    maxRecommendations: number;
  };
}

// UI and component types
export interface QuizProps {
  questions: Question[];
  pathways: CareerPathway[];
  scoringMatrix: ScoringMatrix;
  onComplete: (results: AssessmentResults) => void;
  onProgress?: (progress: number) => void;
  theme?: ThemeConfig;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  showProgress: boolean;
  showQuestionNumbers: boolean;
  animationSpeed: 'fast' | 'normal' | 'slow';
}

// WordPress integration types
export interface WordPressConfig {
  shortcode: string;
  theme: string;
  saveResults: boolean;
  showProgress: boolean;
  redirectUrl?: string;
  customCss?: string;
}

// Analytics and tracking types
export interface AnalyticsEvent {
  type: 'question_viewed' | 'question_answered' | 'section_completed' | 'assessment_completed' | 'pathway_explored';
  sessionId: string;
  questionId?: string;
  value?: number;
  pathwayId?: string;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
}

export interface AnalyticsSummary {
  totalSessions: number;
  completionRate: number;
  averageTimeToComplete: number;
  mostPopularPathways: Array<{
    pathwayId: string;
    count: number;
    percentage: number;
  }>;
  questionMetrics: Array<{
    questionId: string;
    responseDistribution: Record<number, number>;
    averageResponse: number;
    skipRate: number;
  }>;
}

// Error and validation types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ContentError {
  file: string;
  line?: number;
  type: 'parse_error' | 'validation_error' | 'consistency_error';
  message: string;
  severity: 'error' | 'warning';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface AssessmentSubmission {
  responses: AssessmentResponse[];
  sessionMetadata: {
    duration: number;
    userAgent: string;
    referrer?: string;
    timestamp: Date;
  };
}

// Skills gap analysis
export interface SkillsGapAnalysis {
  currentSkills: Record<string, number>;
  requiredSkills: Record<string, number>;
  gaps: Array<{
    skill: string;
    currentLevel: number;
    requiredLevel: number;
    gapSize: number;
    priority: 'high' | 'medium' | 'low';
    developmentPath: string[];
    timeToAcquire: string;
  }>;
  strengths: string[];
  recommendations: Array<{
    skill: string;
    resources: Array<{
      type: 'course' | 'certification' | 'experience' | 'book' | 'online';
      title: string;
      provider: string;
      url?: string;
      duration: string;
      cost?: string;
    }>;
  }>;
}

// Anonymous peer comparison
export interface PeerComparison {
  percentile: number;
  demographicGroup: {
    ageRange: string;
    educationLevel: string;
    region: string;
  };
  comparison: {
    hollandSimilarity: number;
    interestAlignment: number;
    careerMaturityLevel: 'below_average' | 'average' | 'above_average';
    explorationLevel: 'low' | 'moderate' | 'high';
  };
  insights: string[];
}
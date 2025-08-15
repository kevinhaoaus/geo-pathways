import type {
  Question,
  CareerPathway,
  AssessmentResponse,
  AssessmentResults,
  HollandProfile,
  ScienceIdentityProfile,
  SelfEfficacyProfile,
  ValuesProfile,
  PathwayMatch,
  Recommendation,
  ScoringMatrix,
  HollandCode,
  OutcomeExpectations,
  EnvironmentalFactors,
  MultipleIntelligences,
  LearningStyle,
  WorkEnvironment,
  CareerMaturity,
  SkillsGapAnalysis,
  PeerComparison
} from '@/types';

/**
 * Enhanced Assessment Engine with Research-Backed Features
 * 
 * Integrates multiple career development theories:
 * - Holland's RIASEC theory
 * - Social Cognitive Career Theory (Lent, Brown, Hackett)
 * - Super's Career Development Theory
 * - Gardner's Multiple Intelligence Theory
 * - Kolb's Learning Style Theory
 * - Person-Environment Fit Theory
 */
export class EnhancedAssessmentEngine {
  private questions: Question[];
  private pathways: CareerPathway[];
  private scoringMatrix: ScoringMatrix;
  private skillsDatabase: Map<string, any>;

  constructor(questions: Question[], pathways: CareerPathway[], scoringMatrix: ScoringMatrix) {
    this.questions = questions;
    this.pathways = pathways;
    this.scoringMatrix = scoringMatrix;
    this.skillsDatabase = this.loadSkillsDatabase();
  }

  /**
   * Main assessment calculation with all enhanced features
   */
  public calculateEnhancedResults(responses: AssessmentResponse[]): AssessmentResults {
    const responseMap = new Map(responses.map(r => [r.questionId, r.value]));
    
    // Core assessments (existing)
    const hollandProfile = this.calculateHollandProfile(responseMap);
    const scienceIdentity = this.calculateScienceIdentity(responseMap);
    const selfEfficacy = this.calculateSelfEfficacy(responseMap);
    const values = this.calculateValues(responseMap);
    
    // Enhanced assessments (new)
    const outcomeExpectations = this.calculateOutcomeExpectations(responseMap);
    const environmentalFactors = this.calculateEnvironmentalFactors(responseMap);
    const multipleIntelligences = this.calculateMultipleIntelligences(responseMap);
    const learningStyle = this.calculateLearningStyle(responseMap);
    const workEnvironment = this.calculateWorkEnvironment(responseMap);
    const careerMaturity = this.calculateCareerMaturity(responseMap);
    
    // Advanced analysis
    const pathwayMatches = this.enhancedPathwayMatching(
      hollandProfile, scienceIdentity, selfEfficacy, values,
      outcomeExpectations, multipleIntelligences, learningStyle, workEnvironment
    );
    
    const skillsGapAnalysis = this.calculateSkillsGap(pathwayMatches, responses);
    const recommendations = this.generateEnhancedRecommendations(
      pathwayMatches, scienceIdentity, selfEfficacy, careerMaturity, skillsGapAnalysis
    );
    
    const confidenceScore = this.calculateEnhancedConfidence(responses, pathwayMatches);
    const peerComparison = this.generatePeerComparison(hollandProfile, careerMaturity);

    return {
      hollandProfile,
      scienceIdentity,
      selfEfficacy,
      values,
      pathwayMatches,
      recommendations,
      confidenceScore,
      outcomeExpectations,
      environmentalFactors,
      multipleIntelligences,
      learningStyle,
      workEnvironment,
      careerMaturity,
      skillsGapAnalysis,
      peerComparison
    };
  }

  /**
   * Social Cognitive Career Theory: Outcome Expectations
   * Based on Lent, Brown, & Hackett (2000)
   */
  private calculateOutcomeExpectations(responseMap: Map<string, number>): OutcomeExpectations {
    const outcomeQuestions = this.questions.filter(q => q.category === 'outcome-expectations');
    
    return {
      financial: this.calculateDimensionScore(outcomeQuestions, responseMap, 'financial'),
      personalSatisfaction: this.calculateDimensionScore(outcomeQuestions, responseMap, 'satisfaction'),
      socialImpact: this.calculateDimensionScore(outcomeQuestions, responseMap, 'social_impact'),
      workLifeBalance: this.calculateDimensionScore(outcomeQuestions, responseMap, 'work_life_balance'),
      careerAdvancement: this.calculateDimensionScore(outcomeQuestions, responseMap, 'advancement'),
      jobSecurity: this.calculateDimensionScore(outcomeQuestions, responseMap, 'security'),
      intellectualStimulation: this.calculateDimensionScore(outcomeQuestions, responseMap, 'intellectual')
    };
  }

  /**
   * Environmental supports and barriers assessment
   * Critical component of Social Cognitive Career Theory
   */
  private calculateEnvironmentalFactors(responseMap: Map<string, number>): EnvironmentalFactors {
    const envQuestions = this.questions.filter(q => q.subcategory.includes('environmental'));
    
    return {
      familySupport: this.calculateDimensionScore(envQuestions, responseMap, 'family'),
      financialResources: this.calculateDimensionScore(envQuestions, responseMap, 'financial'),
      educationalOpportunities: this.calculateDimensionScore(envQuestions, responseMap, 'education'),
      roleModelAccess: this.calculateDimensionScore(envQuestions, responseMap, 'role_models'),
      peerSupport: this.calculateDimensionScore(envQuestions, responseMap, 'peers'),
      communityResources: this.calculateDimensionScore(envQuestions, responseMap, 'community')
    };
  }

  /**
   * Multiple Intelligence assessment adapted for Earth Sciences
   * Based on Gardner's theory with Earth Science relevance weighting
   */
  private calculateMultipleIntelligences(responseMap: Map<string, number>): MultipleIntelligences {
    const miQuestions = this.questions.filter(q => q.category === 'multiple-intelligence');
    
    return {
      spatial: this.calculateDimensionScore(miQuestions, responseMap, 'spatial') * 1.3, // Weighted higher for Earth Sciences
      logicalMath: this.calculateDimensionScore(miQuestions, responseMap, 'logical_math') * 1.2,
      naturalist: this.calculateDimensionScore(miQuestions, responseMap, 'naturalist') * 1.4, // Highest weight
      linguistic: this.calculateDimensionScore(miQuestions, responseMap, 'linguistic'),
      kinesthetic: this.calculateDimensionScore(miQuestions, responseMap, 'kinesthetic') * 1.1,
      interpersonal: this.calculateDimensionScore(miQuestions, responseMap, 'interpersonal'),
      intrapersonal: this.calculateDimensionScore(miQuestions, responseMap, 'intrapersonal'),
      musical: this.calculateDimensionScore(miQuestions, responseMap, 'musical') * 0.8
    };
  }

  /**
   * Learning Style assessment based on Kolb's model
   * Critical for educational pathway recommendations
   */
  private calculateLearningStyle(responseMap: Map<string, number>): LearningStyle {
    const lsQuestions = this.questions.filter(q => q.category === 'learning-style');
    
    const ce = this.calculateDimensionScore(lsQuestions, responseMap, 'concrete_experience');
    const ac = this.calculateDimensionScore(lsQuestions, responseMap, 'abstract_conceptualization');
    const ae = this.calculateDimensionScore(lsQuestions, responseMap, 'active_experimentation');
    const ro = this.calculateDimensionScore(lsQuestions, responseMap, 'reflective_observation');
    
    return {
      concreteExperience: ce,
      abstractConceptualization: ac,
      activeExperimentation: ae,
      reflectiveObservation: ro
    };
  }

  /**
   * Work environment preferences assessment
   * Enhanced Person-Environment Fit evaluation
   */
  private calculateWorkEnvironment(responseMap: Map<string, number>): WorkEnvironment {
    const weQuestions = this.questions.filter(q => q.category === 'work-environment');
    
    return {
      physical: {
        indoor: this.calculateDimensionScore(weQuestions, responseMap, 'indoor'),
        outdoor: this.calculateDimensionScore(weQuestions, responseMap, 'outdoor'),
        laboratory: this.calculateDimensionScore(weQuestions, responseMap, 'laboratory'),
        office: this.calculateDimensionScore(weQuestions, responseMap, 'office'),
        field: this.calculateDimensionScore(weQuestions, responseMap, 'field'),
        remote: this.calculateDimensionScore(weQuestions, responseMap, 'remote')
      },
      social: {
        teamwork: this.calculateDimensionScore(weQuestions, responseMap, 'teamwork'),
        independent: this.calculateDimensionScore(weQuestions, responseMap, 'independent'),
        publicInteraction: this.calculateDimensionScore(weQuestions, responseMap, 'public'),
        mentoring: this.calculateDimensionScore(weQuestions, responseMap, 'mentoring'),
        leadership: this.calculateDimensionScore(weQuestions, responseMap, 'leadership')
      },
      organizational: {
        structured: this.calculateDimensionScore(weQuestions, responseMap, 'structured'),
        flexible: this.calculateDimensionScore(weQuestions, responseMap, 'flexible'),
        hierarchical: this.calculateDimensionScore(weQuestions, responseMap, 'hierarchical'),
        collaborative: this.calculateDimensionScore(weQuestions, responseMap, 'collaborative'),
        entrepreneurial: this.calculateDimensionScore(weQuestions, responseMap, 'entrepreneurial')
      }
    };
  }

  /**
   * Career Maturity assessment based on Super's theory
   * Measures readiness for career decision-making
   */
  private calculateCareerMaturity(responseMap: Map<string, number>): CareerMaturity {
    const cmQuestions = this.questions.filter(q => q.category === 'career-maturity');
    
    return {
      careerPlanning: this.calculateDimensionScore(cmQuestions, responseMap, 'planning'),
      careerExploration: this.calculateDimensionScore(cmQuestions, responseMap, 'exploration'),
      worldOfWorkInfo: this.calculateDimensionScore(cmQuestions, responseMap, 'work_knowledge'),
      knowledgeOfPreferredGroup: this.calculateDimensionScore(cmQuestions, responseMap, 'field_knowledge'),
      careerDecisionMaking: this.calculateDimensionScore(cmQuestions, responseMap, 'decision_making')
    };
  }

  /**
   * Skills gap analysis with specific development pathways
   */
  private calculateSkillsGap(pathwayMatches: PathwayMatch[], responses: AssessmentResponse[]): SkillsGapAnalysis {
    const topPathways = pathwayMatches.slice(0, 3);
    const currentSkills = this.assessCurrentSkills(responses);
    
    const gaps: SkillsGapAnalysis['gaps'] = [];
    const recommendations: SkillsGapAnalysis['recommendations'] = [];
    
    for (const match of topPathways) {
      const requiredSkills = this.getPathwayRequiredSkills(match.pathway);
      
      for (const [skill, required] of Object.entries(requiredSkills)) {
        const current = currentSkills[skill] || 0;
        const gapSize = Math.max(0, required - current);
        
        if (gapSize > 0.5) { // Significant gap
          gaps.push({
            skill,
            currentLevel: current,
            requiredLevel: required,
            gapSize,
            priority: this.calculateSkillPriority(skill, gapSize, match.matchScore),
            developmentPath: this.getSkillDevelopmentPath(skill),
            timeToAcquire: this.estimateTimeToAcquire(skill, gapSize)
          });
          
          recommendations.push({
            skill,
            resources: this.getSkillResources(skill)
          });
        }
      }
    }
    
    const strengths = Object.entries(currentSkills)
      .filter(([_, score]) => score >= 4.0)
      .map(([skill, _]) => skill);
    
    return {
      currentSkills,
      requiredSkills: this.aggregateRequiredSkills(topPathways),
      gaps: gaps.sort((a, b) => b.gapSize - a.gapSize).slice(0, 10),
      strengths,
      recommendations: recommendations.slice(0, 5)
    };
  }

  /**
   * Enhanced pathway matching with all assessment dimensions
   */
  private enhancedPathwayMatching(
    holland: HollandProfile,
    identity: ScienceIdentityProfile,
    efficacy: SelfEfficacyProfile,
    values: ValuesProfile,
    outcomes: OutcomeExpectations,
    intelligences: MultipleIntelligences,
    learning: LearningStyle,
    environment: WorkEnvironment
  ): PathwayMatch[] {
    const matches: PathwayMatch[] = [];

    for (const pathway of this.pathways) {
      const baseScore = this.calculateBasePathwayScore(pathway, holland, identity, efficacy, values);
      
      // Enhanced scoring with new dimensions
      const outcomeAlignment = this.calculateOutcomeAlignment(pathway, outcomes);
      const intelligenceAlignment = this.calculateIntelligenceAlignment(pathway, intelligences);
      const learningAlignment = this.calculateLearningAlignment(pathway, learning);
      const environmentAlignment = this.calculateEnvironmentAlignment(pathway, environment);
      
      const enhancedScore = (
        baseScore * 0.6 +
        outcomeAlignment * 0.15 +
        intelligenceAlignment * 0.1 +
        learningAlignment * 0.08 +
        environmentAlignment * 0.07
      );
      
      const confidenceLevel = this.determineConfidenceLevel(enhancedScore);
      const reasonsForMatch = this.generateEnhancedMatchReasons(pathway, holland, intelligences, learning);
      const considerations = this.generateEnhancedConsiderations(pathway, outcomes, environment);

      matches.push({
        pathway,
        matchScore: enhancedScore,
        confidenceLevel,
        reasonsForMatch,
        considerations
      });
    }

    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, this.scoringMatrix.thresholds.maxRecommendations);
  }

  /**
   * Peer comparison with anonymous demographic data
   */
  private generatePeerComparison(holland: HollandProfile, maturity: CareerMaturity): PeerComparison {
    // This would connect to an anonymous database in production
    // For now, generate realistic simulated data
    
    const percentile = this.calculatePercentile(holland, maturity);
    
    return {
      percentile,
      demographicGroup: {
        ageRange: '16-18',
        educationLevel: 'High School',
        region: 'North America'
      },
      comparison: {
        hollandSimilarity: Math.random() * 0.4 + 0.3, // 30-70% similarity range
        interestAlignment: Math.random() * 0.5 + 0.4,
        careerMaturityLevel: this.categorizeMaturityLevel(maturity),
        explorationLevel: this.categorizeExplorationLevel(maturity.careerExploration)
      },
      insights: this.generatePeerInsights(percentile, maturity)
    };
  }

  // Helper methods
  private calculateDimensionScore(questions: Question[], responseMap: Map<string, number>, dimension: string): number {
    const dimensionQuestions = questions.filter(q => 
      q.subcategory.includes(dimension) || q.id.includes(dimension)
    );
    
    if (dimensionQuestions.length === 0) return 2.5; // Neutral default
    
    let totalScore = 0;
    let totalWeight = 0;
    
    dimensionQuestions.forEach(question => {
      const response = responseMap.get(question.id);
      if (response !== undefined) {
        totalScore += response * question.weight;
        totalWeight += question.weight;
      }
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 2.5;
  }

  private loadSkillsDatabase(): Map<string, any> {
    // In production, this would load from a comprehensive skills database
    return new Map([
      ['Python Programming', { category: 'technical', earthScienceRelevance: 0.9 }],
      ['GIS Software', { category: 'technical', earthScienceRelevance: 1.0 }],
      ['Statistical Analysis', { category: 'analytical', earthScienceRelevance: 0.8 }],
      ['Field Sampling', { category: 'practical', earthScienceRelevance: 1.0 }],
      ['Technical Writing', { category: 'communication', earthScienceRelevance: 0.7 }],
      ['Data Visualization', { category: 'technical', earthScienceRelevance: 0.8 }],
      // ... more skills would be loaded here
    ]);
  }

  // Additional helper methods would be implemented here...
  private calculateHollandProfile(responseMap: Map<string, number>): HollandProfile {
    // Implementation from original assessment engine
    const hollandScores: Record<HollandCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    // ... existing implementation
    return {
      scores: hollandScores,
      primaryCode: 'I', // placeholder
      secondaryCode: 'R',
      profile: 'IR'
    };
  }

  private calculateScienceIdentity(responseMap: Map<string, number>): ScienceIdentityProfile {
    // Implementation from original assessment engine
    return {
      exploration: 3.5,
      commitment: 4.0,
      status: 'Achievement',
      description: 'Strong science identity with clear direction'
    };
  }

  private calculateSelfEfficacy(responseMap: Map<string, number>): SelfEfficacyProfile {
    // Implementation from original assessment engine
    return {
      overall: 3.8,
      levels: { basic: 4.0, applied: 3.8, inquiry: 3.5, innovation: 3.2 },
      strengths: ['Strong foundational knowledge'],
      developmentAreas: ['Creative problem-solving']
    };
  }

  private calculateValues(responseMap: Map<string, number>): ValuesProfile {
    // Implementation from original assessment engine
    return {
      topValues: [],
      categories: {}
    };
  }

  // Placeholder implementations for other helper methods...
  private calculateBasePathwayScore(pathway: CareerPathway, holland: HollandProfile, identity: ScienceIdentityProfile, efficacy: SelfEfficacyProfile, values: ValuesProfile): number {
    return 0.75; // Placeholder
  }

  private calculateOutcomeAlignment(pathway: CareerPathway, outcomes: OutcomeExpectations): number {
    return 0.8; // Placeholder
  }

  private calculateIntelligenceAlignment(pathway: CareerPathway, intelligences: MultipleIntelligences): number {
    return 0.7; // Placeholder
  }

  private calculateLearningAlignment(pathway: CareerPathway, learning: LearningStyle): number {
    return 0.75; // Placeholder
  }

  private calculateEnvironmentAlignment(pathway: CareerPathway, environment: WorkEnvironment): number {
    return 0.8; // Placeholder
  }

  private generateEnhancedMatchReasons(pathway: CareerPathway, holland: HollandProfile, intelligences: MultipleIntelligences, learning: LearningStyle): string[] {
    return ['Enhanced matching reasons']; // Placeholder
  }

  private generateEnhancedConsiderations(pathway: CareerPathway, outcomes: OutcomeExpectations, environment: WorkEnvironment): string[] {
    return ['Enhanced considerations']; // Placeholder
  }

  private generateEnhancedRecommendations(pathwayMatches: PathwayMatch[], identity: ScienceIdentityProfile, efficacy: SelfEfficacyProfile, maturity: CareerMaturity, skillsGap: SkillsGapAnalysis): Recommendation[] {
    return []; // Placeholder
  }

  private calculateEnhancedConfidence(responses: AssessmentResponse[], matches: PathwayMatch[]): number {
    return 85; // Placeholder
  }

  private determineConfidenceLevel(score: number): 'High' | 'Moderate' | 'Low' {
    if (score >= 0.75) return 'High';
    if (score >= 0.6) return 'Moderate';
    return 'Low';
  }

  private assessCurrentSkills(responses: AssessmentResponse[]): Record<string, number> {
    return {}; // Placeholder
  }

  private getPathwayRequiredSkills(pathway: CareerPathway): Record<string, number> {
    return {}; // Placeholder
  }

  private calculateSkillPriority(skill: string, gapSize: number, matchScore: number): 'high' | 'medium' | 'low' {
    return 'medium'; // Placeholder
  }

  private getSkillDevelopmentPath(skill: string): string[] {
    return []; // Placeholder
  }

  private estimateTimeToAcquire(skill: string, gapSize: number): string {
    return '3-6 months'; // Placeholder
  }

  private getSkillResources(skill: string): any[] {
    return []; // Placeholder
  }

  private aggregateRequiredSkills(pathways: PathwayMatch[]): Record<string, number> {
    return {}; // Placeholder
  }

  private calculatePercentile(holland: HollandProfile, maturity: CareerMaturity): number {
    return 65; // Placeholder
  }

  private categorizeMaturityLevel(maturity: CareerMaturity): 'below_average' | 'average' | 'above_average' {
    const avg = (maturity.careerPlanning + maturity.careerExploration + maturity.careerDecisionMaking) / 3;
    if (avg >= 4.0) return 'above_average';
    if (avg >= 3.0) return 'average';
    return 'below_average';
  }

  private categorizeExplorationLevel(exploration: number): 'low' | 'moderate' | 'high' {
    if (exploration >= 4.0) return 'high';
    if (exploration >= 3.0) return 'moderate';
    return 'low';
  }

  private generatePeerInsights(percentile: number, maturity: CareerMaturity): string[] {
    const insights = [];
    
    if (percentile > 75) {
      insights.push("You show higher career exploration than most peers your age");
    }
    
    if (maturity.careerPlanning > 4.0) {
      insights.push("Your career planning skills are well-developed for your age group");
    }
    
    return insights;
  }
}
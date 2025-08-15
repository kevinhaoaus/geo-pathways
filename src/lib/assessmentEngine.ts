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
  HollandCode
} from '@/types';

/**
 * Core Assessment Engine
 * Handles scoring logic and career pathway matching
 */
export class AssessmentEngine {
  private questions: Question[];
  private pathways: CareerPathway[];
  private scoringMatrix: ScoringMatrix;

  constructor(questions: Question[], pathways: CareerPathway[], scoringMatrix: ScoringMatrix) {
    this.questions = questions;
    this.pathways = pathways;
    this.scoringMatrix = scoringMatrix;
  }

  /**
   * Calculate comprehensive assessment results
   */
  public calculateResults(responses: AssessmentResponse[]): AssessmentResults {
    const responseMap = new Map(responses.map(r => [r.questionId, r.value]));
    
    // Calculate individual assessment dimensions
    const hollandProfile = this.calculateHollandProfile(responseMap);
    const scienceIdentity = this.calculateScienceIdentity(responseMap);
    const selfEfficacy = this.calculateSelfEfficacy(responseMap);
    const values = this.calculateValues(responseMap);
    
    // Match pathways based on all dimensions
    const pathwayMatches = this.matchPathways(hollandProfile, scienceIdentity, selfEfficacy, values);
    
    // Generate personalized recommendations
    const recommendations = this.generateRecommendations(pathwayMatches, scienceIdentity, selfEfficacy);
    
    // Calculate overall confidence in recommendations
    const confidenceScore = this.calculateConfidenceScore(pathwayMatches, responses);

    return {
      hollandProfile,
      scienceIdentity,
      selfEfficacy,
      values,
      pathwayMatches,
      recommendations,
      confidenceScore
    };
  }

  /**
   * Calculate Holland Code (RIASEC) profile
   */
  private calculateHollandProfile(responseMap: Map<string, number>): HollandProfile {
    const hollandScores: Record<HollandCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const codeQuestions: Record<HollandCode, Question[]> = { R: [], I: [], A: [], S: [], E: [], C: [] };

    // Group Holland Code questions by type
    this.questions
      .filter(q => q.category === 'holland-code')
      .forEach(question => {
        const code = this.getHollandCodeFromSubcategory(question.subcategory);
        if (code) {
          codeQuestions[code].push(question);
        }
      });

    // Calculate weighted scores for each Holland type
    for (const [code, questions] of Object.entries(codeQuestions) as [HollandCode, Question[]][]) {
      let totalScore = 0;
      let totalWeight = 0;

      questions.forEach(question => {
        const response = responseMap.get(question.id);
        if (response !== undefined) {
          const weight = question.weight * this.scoringMatrix.hollandCodeWeights[code];
          totalScore += response * weight;
          totalWeight += weight;
        }
      });

      hollandScores[code] = totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    // Determine primary and secondary codes
    const sortedCodes = (Object.entries(hollandScores) as [HollandCode, number][])
      .sort((a, b) => b[1] - a[1]);

    const primaryCode = sortedCodes[0][0];
    const secondaryCode = sortedCodes[1][1] > sortedCodes[0][1] * 0.8 ? sortedCodes[1][0] : undefined;

    // Create profile string
    const profile = secondaryCode ? `${primaryCode}${secondaryCode}` : primaryCode;

    return {
      scores: hollandScores,
      primaryCode,
      secondaryCode,
      profile
    };
  }

  /**
   * Calculate Science Identity profile
   */
  private calculateScienceIdentity(responseMap: Map<string, number>): ScienceIdentityProfile {
    const explorationQuestions = this.questions.filter(q => 
      q.category === 'science-identity' && q.subcategory === 'exploration'
    );
    const commitmentQuestions = this.questions.filter(q => 
      q.category === 'science-identity' && q.subcategory === 'commitment'
    );

    const exploration = this.calculateAverageScore(explorationQuestions, responseMap);
    const commitment = this.calculateAverageScore(commitmentQuestions, responseMap);

    // Determine identity status based on Marcia's identity framework
    let status: ScienceIdentityProfile['status'];
    let description: string;

    if (exploration >= 3.5 && commitment >= 3.5) {
      status = 'Achievement';
      description = 'High exploration and commitment - strong science identity with clear direction';
    } else if (exploration >= 3.5 && commitment < 3.5) {
      status = 'Moratorium';
      description = 'High exploration but lower commitment - actively exploring science options';
    } else if (exploration < 3.5 && commitment >= 3.5) {
      status = 'Foreclosure';
      description = 'Lower exploration but high commitment - may benefit from broader career exploration';
    } else {
      status = 'Diffusion';
      description = 'Lower exploration and commitment - would benefit from structured science career exploration';
    }

    return { exploration, commitment, status, description };
  }

  /**
   * Calculate Self-Efficacy profile across different skill levels
   */
  /**
   * Calculate Self-Efficacy profile across different skill levels
   */
  private calculateSelfEfficacy(responseMap: Map<string, number>): SelfEfficacyProfile {
    const selfEfficacyQuestions = this.questions.filter(q => q.category === 'self-efficacy');
    
    // Group questions by skill type based on actual subcategories
    const skillGroups = {
      math: selfEfficacyQuestions.filter(q => q.subcategory.includes('math')),
      field: selfEfficacyQuestions.filter(q => q.subcategory.includes('field')),
      data: selfEfficacyQuestions.filter(q => q.subcategory.includes('data')),
      general: selfEfficacyQuestions.filter(q => !q.subcategory.includes('math') && !q.subcategory.includes('field') && !q.subcategory.includes('data'))
    };

    const skillScores = {
      basic: this.calculateAverageScore([...skillGroups.math, ...skillGroups.general], responseMap),
      applied: this.calculateAverageScore(skillGroups.field, responseMap),
      inquiry: this.calculateAverageScore(skillGroups.data, responseMap),
      innovation: this.calculateAverageScore(selfEfficacyQuestions, responseMap)
    };

    // Calculate weighted overall score
    const overall = skillScores.innovation > 0 ? skillScores.innovation : 
      (skillScores.basic * 0.3 + skillScores.applied * 0.4 + skillScores.inquiry * 0.3);

    // Identify strengths and development areas
    const strengths: string[] = [];
    const developmentAreas: string[] = [];

    if (skillScores.basic >= 4.0) strengths.push('Strong foundational confidence');
    if (skillScores.applied >= 4.0) strengths.push('Confident in practical applications');
    if (skillScores.inquiry >= 4.0) strengths.push('Strong data analysis confidence');
    if (overall >= 4.0) strengths.push('Overall high science confidence');

    if (skillScores.basic < 3.0) developmentAreas.push('Build foundational confidence');
    if (skillScores.applied < 3.0) developmentAreas.push('Gain more hands-on experience');
    if (skillScores.inquiry < 3.0) developmentAreas.push('Practice data analysis skills');

    return {
      overall,
      levels: skillScores,
      strengths,
      developmentAreas
    };
  }

  /**
   * Calculate Values profile
   */
  private calculateValues(responseMap: Map<string, number>): ValuesProfile {
    const valuesQuestions = this.questions.filter(q => q.category === 'values');
    
    // Define value categories and their associated questions
    const valueCategories = {
      'Environmental Stewardship': ['environmental_stewardship', 'protecting_resources', 'future_generations'],
      'Scientific Discovery': ['discovery', 'advancing_knowledge', 'intellectual_stimulation'],
      'Work Environment': ['outdoor_work', 'laboratory_work', 'travel_opportunities'],
      'Financial Security': ['high_salary', 'job_security', 'earning_potential'],
      'Social Impact': ['helping_communities', 'teaching_others', 'policy_influence'],
      'Independence': ['working_independently', 'flexible_schedule', 'entrepreneurship']
    };

    const categoryScores: Record<string, number> = {};
    const topValues: Array<{ name: string; score: number; description: string }> = [];

    // Calculate scores for each value category
    for (const [category, subcategories] of Object.entries(valueCategories)) {
      const categoryQuestions = valuesQuestions.filter(q => 
        subcategories.some(sub => q.subcategory.includes(sub) || q.id.includes(sub))
      );
      
      categoryScores[category] = this.calculateAverageScore(categoryQuestions, responseMap);
    }

    // Get top 5 values
    const sortedValues = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    sortedValues.forEach(([name, score]) => {
      topValues.push({
        name,
        score,
        description: this.getValueDescription(name)
      });
    });

    return { topValues, categories: categoryScores };
  }

  /**
   * Match career pathways based on all assessment dimensions
   */
  private matchPathways(
    holland: HollandProfile,
    identity: ScienceIdentityProfile,
    efficacy: SelfEfficacyProfile,
    values: ValuesProfile
  ): PathwayMatch[] {
    const matches: PathwayMatch[] = [];

    for (const pathway of this.pathways) {
      const matchScore = this.calculatePathwayMatchScore(pathway, holland, identity, efficacy, values);
      const confidenceLevel = this.determineConfidenceLevel(matchScore);
      const reasonsForMatch = this.generateMatchReasons(pathway, holland, identity, efficacy, values);
      const considerations = this.generateConsiderations(pathway, holland, identity, efficacy);

      matches.push({
        pathway,
        matchScore,
        confidenceLevel,
        reasonsForMatch,
        considerations
      });
    }

    // Sort by match score and return top matches
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, this.scoringMatrix.thresholds.maxRecommendations);
  }

  /**
   * Calculate match score between user profile and pathway
   */
  private calculatePathwayMatchScore(
    pathway: CareerPathway,
    holland: HollandProfile,
    identity: ScienceIdentityProfile,
    efficacy: SelfEfficacyProfile,
    values: ValuesProfile
  ): number {
    const weights = this.scoringMatrix.pathwayMatchingWeights;
    
    // Holland Code alignment
    const hollandAlignment = this.calculateHollandAlignment(pathway, holland);
    
    // Science identity contribution
    const identityContribution = (identity.exploration + identity.commitment) / 10; // normalize to 0-1
    
    // Self-efficacy fit
    const efficacyFit = efficacy.overall / 5; // normalize to 0-1
    
    // Values alignment
    const valuesAlignment = this.calculateValuesAlignment(pathway, values);
    
    // Career knowledge bonus (placeholder - would be implemented with knowledge questions)
    const knowledgeBonus = 0.5;

    const matchScore = (
      hollandAlignment * weights.interests +
      identityContribution * weights.identity +
      efficacyFit * weights.selfEfficacy +
      valuesAlignment * weights.values +
      knowledgeBonus * weights.knowledge
    );

    return Math.min(Math.max(matchScore, 0), 1); // Ensure 0-1 range
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    pathwayMatches: PathwayMatch[],
    identity: ScienceIdentityProfile,
    efficacy: SelfEfficacyProfile
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Immediate recommendations based on top matches
    if (pathwayMatches.length > 0) {
      const topMatch = pathwayMatches[0];
      recommendations.push({
        type: 'immediate',
        category: 'exploration',
        title: `Explore ${topMatch.pathway.title}`,
        description: `Based on your assessment, ${topMatch.pathway.title} shows strong alignment with your interests and profile.`,
        actionSteps: [
          'Research day-in-the-life descriptions of professionals in this field',
          'Look for internship or shadowing opportunities',
          'Connect with professionals through LinkedIn or professional organizations'
        ]
      });
    }

    // Education recommendations based on science identity status
    if (identity.status === 'Moratorium' || identity.status === 'Diffusion') {
      recommendations.push({
        type: 'short_term',
        category: 'exploration',
        title: 'Expand Career Exploration',
        description: 'Your assessment suggests you would benefit from broader career exploration.',
        actionSteps: [
          'Attend career fairs and information sessions',
          'Take personality and interest assessments',
          'Schedule informational interviews with professionals',
          'Join relevant student organizations or clubs'
        ]
      });
    }

    // Skills development based on self-efficacy gaps
    if (efficacy.developmentAreas.length > 0) {
      recommendations.push({
        type: 'long_term',
        category: 'skills',
        title: 'Skill Development Focus',
        description: 'Strengthening these areas will improve your preparation for Earth Science careers.',
        actionSteps: efficacy.developmentAreas.map(area => `Work on: ${area}`)
      });
    }

    return recommendations;
  }

  /**
   * Helper methods
   */
  private getHollandCodeFromSubcategory(subcategory: string): HollandCode | null {
    const mapping: Record<string, HollandCode> = {
      'realistic': 'R',
      'investigative': 'I',
      'artistic': 'A',
      'social': 'S',
      'enterprising': 'E',
      'conventional': 'C'
    };
    return mapping[subcategory] || null;
  }

  private calculateAverageScore(questions: Question[], responseMap: Map<string, number>): number {
    if (questions.length === 0) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;

    questions.forEach(question => {
      const response = responseMap.get(question.id);
      if (response !== undefined) {
        totalScore += response * question.weight;
        totalWeight += question.weight;
      }
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private calculateHollandAlignment(pathway: CareerPathway, holland: HollandProfile): number {
    if (!pathway.holland_codes || pathway.holland_codes.length === 0) return 0.5;
    
    let alignment = 0;
    for (const code of pathway.holland_codes) {
      alignment += holland.scores[code];
    }
    
    return Math.min(alignment / (pathway.holland_codes.length * 5), 1); // Normalize to 0-1
  }

  private calculateValuesAlignment(pathway: CareerPathway, values: ValuesProfile): number {
    // This would be more sophisticated in a real implementation
    // For now, return a placeholder based on pathway category
    if (pathway.category === 'emerging') return 0.7;
    if (pathway.category === 'traditional') return 0.6;
    return 0.5;
  }

  private determineConfidenceLevel(matchScore: number): 'High' | 'Moderate' | 'Low' {
    if (matchScore >= this.scoringMatrix.thresholds.highMatch) return 'High';
    if (matchScore >= this.scoringMatrix.thresholds.moderateMatch) return 'Moderate';
    return 'Low';
  }

  private generateMatchReasons(
    pathway: CareerPathway,
    holland: HollandProfile,
    identity: ScienceIdentityProfile,
    efficacy: SelfEfficacyProfile,
    values: ValuesProfile
  ): string[] {
    const reasons: string[] = [];
    
    // Holland Code reasons
    if (pathway.holland_codes?.includes(holland.primaryCode)) {
      reasons.push(`Strong match with your ${holland.primaryCode} (${this.getHollandDescription(holland.primaryCode)}) interests`);
    }
    
    // Science identity reasons  
    if (identity.status === 'Achievement') {
      reasons.push('Your strong science identity aligns well with this career path');
    }
    
    // Self-efficacy reasons
    if (efficacy.overall >= 4.0) {
      reasons.push('Your confidence in science abilities fits this career well');
    }

    return reasons;
  }

  private generateConsiderations(
    pathway: CareerPathway,
    holland: HollandProfile,
    identity: ScienceIdentityProfile,
    efficacy: SelfEfficacyProfile
  ): string[] {
    const considerations: string[] = [];
    
    // Add considerations based on potential gaps or challenges
    if (efficacy.overall < 3.0) {
      considerations.push('Consider building confidence in science skills through coursework and experiences');
    }
    
    if (identity.status === 'Diffusion') {
      considerations.push('Explore this field through informational interviews and job shadowing before committing');
    }

    return considerations;
  }

  private calculateConfidenceScore(pathwayMatches: PathwayMatch[], responses: AssessmentResponse[]): number {
    // Calculate confidence based on response patterns and match quality
    const completionRate = responses.length / this.questions.length;
    const topMatchScore = pathwayMatches[0]?.matchScore || 0;
    const matchSpread = pathwayMatches.length > 1 ? 
      pathwayMatches[0].matchScore - pathwayMatches[1].matchScore : 0;
    
    return Math.min((completionRate * 0.3 + topMatchScore * 0.5 + matchSpread * 0.2) * 100, 100);
  }

  private getHollandDescription(code: HollandCode): string {
    const descriptions = {
      'R': 'Realistic - hands-on, practical work',
      'I': 'Investigative - research and analysis',
      'A': 'Artistic - creative and expressive',
      'S': 'Social - helping and working with people',
      'E': 'Enterprising - leadership and business',
      'C': 'Conventional - organized and systematic'
    };
    return descriptions[code];
  }

  private getValueDescription(valueName: string): string {
    const descriptions: { [key: string]: string } = {
      'Environmental Stewardship': 'Protecting and preserving natural resources and ecosystems',
      'Scientific Discovery': 'Advancing human knowledge through research and investigation',
      'Work Environment': 'The physical and social setting where work takes place',
      'Financial Security': 'Stable income and economic well-being',
      'Social Impact': 'Making a positive difference in communities and society',
      'Independence': 'Autonomy and self-direction in work activities'
    };
    return descriptions[valueName] || 'Important career consideration';
  }
}
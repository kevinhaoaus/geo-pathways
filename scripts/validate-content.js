#!/usr/bin/env node

/**
 * Content Validation Tool
 * Validates content integrity and consistency across questions and pathways
 * Ensures data quality before compilation
 */

const fs = require('fs').promises;
const path = require('path');
const Joi = require('joi');

const CONTENT_DIR = path.join(__dirname, '../content');
const DATA_DIR = path.join(__dirname, '../src/data');

// Validation schemas
const questionSchema = Joi.object({
  id: Joi.string().required().pattern(/^[a-z_]+_[0-9]+$/),
  category: Joi.string().required().valid('holland-code', 'science-identity', 'values', 'self-efficacy'),
  subcategory: Joi.string().required(),
  text: Joi.string().required().min(10).max(500),
  type: Joi.string().required().valid('likert_5', 'multiple_choice', 'ranking', 'binary'),
  weight: Joi.number().min(0).max(2).default(1.0),
  researchSource: Joi.string().allow('').optional(),
  validation: Joi.string().allow('').optional(),
  responseOptions: Joi.array().items(
    Joi.object({
      value: Joi.number().required(),
      label: Joi.string().required()
    })
  ).min(1).required(),
  pathwayScoring: Joi.object().pattern(
    Joi.string(),
    Joi.number().min(0).max(1)
  ).required()
});

const pathwaySchema = Joi.object({
  pathway_id: Joi.string().required().pattern(/^[a-z_]+$/),
  category: Joi.string().required().valid('traditional', 'emerging', 'interdisciplinary'),
  title: Joi.string().required().min(5).max(100),
  holland_codes: Joi.array().items(
    Joi.string().valid('R', 'I', 'A', 'S', 'E', 'C')
  ).min(1).max(3),
  primary_interests: Joi.array().items(Joi.string()).min(1).max(5),
  growth_rate: Joi.number().min(-10).max(50),
  last_updated: Joi.string().isoDate(),
  data_sources: Joi.array().items(Joi.string()).optional(),
  overview: Joi.string().min(100),
  careerProgression: Joi.alternatives().try(Joi.string(), Joi.object()),
  education: Joi.alternatives().try(Joi.string(), Joi.object()),
  skills: Joi.alternatives().try(Joi.string(), Joi.object()),
  outlook: Joi.alternatives().try(Joi.string(), Joi.object()),
  content: Joi.string().optional()
});

/**
 * Main validation function
 */
async function validateContent() {
  console.log('🔍 Starting content validation...');
  
  const results = {
    questions: { valid: 0, invalid: 0, errors: [] },
    pathways: { valid: 0, invalid: 0, errors: [] },
    consistency: { warnings: [], errors: [] }
  };
  
  try {
    // Validate questions
    await validateQuestions(results);
    
    // Validate pathways
    await validatePathways(results);
    
    // Cross-validate content consistency
    await validateConsistency(results);
    
    // Generate report
    generateValidationReport(results);
    
    // Exit with error code if validation fails
    const hasErrors = results.questions.invalid > 0 || 
                     results.pathways.invalid > 0 || 
                     results.consistency.errors.length > 0;
    
    if (hasErrors) {
      console.log('❌ Validation failed!');
      process.exit(1);
    } else {
      console.log('✅ All content validated successfully!');
    }
    
  } catch (error) {
    console.error('💥 Validation process failed:', error.message);
    process.exit(1);
  }
}

/**
 * Validate question files
 */
async function validateQuestions(results) {
  console.log('📝 Validating questions...');
  
  const questionCategories = ['holland-code', 'science-identity', 'values', 'self-efficacy'];
  
  for (const category of questionCategories) {
    const categoryPath = path.join(CONTENT_DIR, 'questions', category);
    
    try {
      const files = await fs.readdir(categoryPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      for (const file of mdFiles) {
        const filePath = path.join(categoryPath, file);
        await validateQuestionFile(filePath, results);
      }
    } catch (error) {
      results.questions.errors.push({
        file: `questions/${category}`,
        error: `Cannot read directory: ${error.message}`
      });
    }
  }
}

/**
 * Validate individual question file
 */
async function validateQuestionFile(filePath, results) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const questions = parseQuestionsFromMarkdown(content);
    
    for (const question of questions) {
      const { error, value } = questionSchema.validate(question, { abortEarly: false });
      
      if (error) {
        results.questions.invalid++;
        results.questions.errors.push({
          file: path.relative(CONTENT_DIR, filePath),
          questionId: question.id || 'unknown',
          errors: error.details.map(detail => detail.message)
        });
      } else {
        results.questions.valid++;
        
        // Additional custom validations
        validateQuestionConsistency(value, filePath, results);
      }
    }
    
  } catch (error) {
    results.questions.errors.push({
      file: path.relative(CONTENT_DIR, filePath),
      error: `Parse error: ${error.message}`
    });
  }
}

/**
 * Parse questions from markdown content
 */
function parseQuestionsFromMarkdown(content) {
  const questions = [];
  const questionSections = content.split(/(?=## Question \d+)/);
  
  for (const section of questionSections) {
    if (!section.trim() || !section.includes('## Question')) continue;
    
    try {
      const question = parseQuestionFromSection(section);
      if (question) {
        questions.push(question);
      }
    } catch (error) {
      // Individual question parse error - will be caught in validation
    }
  }
  
  return questions;
}

/**
 * Parse question from section
 */
function parseQuestionFromSection(section) {
  const lines = section.split('\n');
  const question = {
    responseOptions: [],
    pathwayScoring: {}
  };
  
  let inYamlBlock = false;
  let yamlBlock = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Handle YAML blocks
    if (trimmedLine === '```yaml') {
      inYamlBlock = true;
      yamlBlock = '';
      continue;
    }
    
    if (trimmedLine === '```' && inYamlBlock) {
      inYamlBlock = false;
      const yamlData = parseYamlBlock(yamlBlock);
      Object.assign(question, yamlData);
      continue;
    }
    
    if (inYamlBlock) {
      yamlBlock += line + '\n';
      continue;
    }
    
    // Extract other data
    if (trimmedLine.startsWith('**Question Text**:')) {
      question.text = trimmedLine.replace('**Question Text**:', '').trim();
    }
    
    if (trimmedLine.match(/^\d+\./)) {
      question.responseOptions.push({
        value: parseInt(trimmedLine.charAt(0)),
        label: trimmedLine.substring(3).trim()
      });
    }
    
    if (trimmedLine.startsWith('- ') && trimmedLine.includes(':')) {
      const [pathway, score] = trimmedLine.substring(2).split(':');
      question.pathwayScoring[pathway.trim()] = parseFloat(score.trim());
    }
  }
  
  return question.id ? question : null;
}

/**
 * Parse YAML block
 */
function parseYamlBlock(yamlString) {
  const result = {};
  const lines = yamlString.split('\n');
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, value] = line.split(':');
      const cleanKey = key.trim();
      const cleanValue = value.trim().replace(/['"]/g, '');
      
      if (!isNaN(cleanValue) && cleanValue !== '') {
        result[cleanKey] = parseFloat(cleanValue);
      } else if (cleanValue === 'true' || cleanValue === 'false') {
        result[cleanKey] = cleanValue === 'true';
      } else {
        result[cleanKey] = cleanValue;
      }
    }
  }
  
  return result;
}

/**
 * Validate question consistency
 */
function validateQuestionConsistency(question, filePath, results) {
  // Check response options consistency
  if (question.type === 'likert_5' && question.responseOptions.length !== 5) {
    results.consistency.warnings.push({
      file: path.relative(CONTENT_DIR, filePath),
      questionId: question.id,
      issue: `Likert-5 question should have exactly 5 response options, found ${question.responseOptions.length}`
    });
  }
  
  // Check pathway scoring completeness
  const pathwayCount = Object.keys(question.pathwayScoring).length;
  if (pathwayCount < 3) {
    results.consistency.warnings.push({
      file: path.relative(CONTENT_DIR, filePath),
      questionId: question.id,
      issue: `Only ${pathwayCount} pathways scored, consider adding more for better matching`
    });
  }
  
  // Check scoring range
  const scores = Object.values(question.pathwayScoring);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  if (maxScore === minScore) {
    results.consistency.warnings.push({
      file: path.relative(CONTENT_DIR, filePath),
      questionId: question.id,
      issue: 'All pathway scores are identical - question may not discriminate effectively'
    });
  }
}

/**
 * Validate pathways
 */
async function validatePathways(results) {
  console.log('🛤️  Validating pathways...');
  
  const pathwayCategories = ['traditional', 'emerging'];
  
  for (const category of pathwayCategories) {
    const categoryPath = path.join(CONTENT_DIR, 'pathways', category);
    
    try {
      const files = await fs.readdir(categoryPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      for (const file of mdFiles) {
        const filePath = path.join(categoryPath, file);
        await validatePathwayFile(filePath, results);
      }
    } catch (error) {
      results.pathways.errors.push({
        file: `pathways/${category}`,
        error: `Cannot read directory: ${error.message}`
      });
    }
  }
}

/**
 * Validate individual pathway file
 */
async function validatePathwayFile(filePath, results) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const pathway = parsePathwayFromMarkdown(content);
    
    const { error, value } = pathwaySchema.validate(pathway, { abortEarly: false });
    
    if (error) {
      results.pathways.invalid++;
      results.pathways.errors.push({
        file: path.relative(CONTENT_DIR, filePath),
        pathwayId: pathway.pathway_id || 'unknown',
        errors: error.details.map(detail => detail.message)
      });
    } else {
      results.pathways.valid++;
      validatePathwayConsistency(value, filePath, results);
    }
    
  } catch (error) {
    results.pathways.errors.push({
      file: path.relative(CONTENT_DIR, filePath),
      error: `Parse error: ${error.message}`
    });
  }
}

/**
 * Parse pathway from markdown
 */
function parsePathwayFromMarkdown(content) {
  const pathway = {};
  
  // Extract title
  const titleMatch = content.match(/^# (.+)$/m);
  if (titleMatch) {
    pathway.title = titleMatch[1];
  }
  
  // Extract YAML frontmatter
  const yamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
  if (yamlMatch) {
    Object.assign(pathway, parseYamlBlock(yamlMatch[1]));
  }
  
  // Extract sections
  const sections = parseMarkdownSections(content);
  Object.assign(pathway, sections);
  
  return pathway;
}

/**
 * Parse markdown sections
 */
function parseMarkdownSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection.toLowerCase().replace(/\s+/g, '_')] = currentContent.join('\n').trim();
      }
      currentSection = line.substring(3).trim();
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  if (currentSection) {
    sections[currentSection.toLowerCase().replace(/\s+/g, '_')] = currentContent.join('\n').trim();
  }
  
  return sections;
}

/**
 * Validate pathway consistency
 */
function validatePathwayConsistency(pathway, filePath, results) {
  // Check content length
  if (pathway.overview && pathway.overview.length < 100) {
    results.consistency.warnings.push({
      file: path.relative(CONTENT_DIR, filePath),
      pathwayId: pathway.pathway_id,
      issue: 'Overview section is very short - consider expanding'
    });
  }
  
  // Check Holland codes
  if (pathway.holland_codes && pathway.holland_codes.length > 3) {
    results.consistency.warnings.push({
      file: path.relative(CONTENT_DIR, filePath),
      pathwayId: pathway.pathway_id,
      issue: 'More than 3 Holland codes specified - may dilute matching effectiveness'
    });
  }
  
  // Check growth rate reasonableness
  if (pathway.growth_rate && (pathway.growth_rate < -5 || pathway.growth_rate > 30)) {
    results.consistency.warnings.push({
      file: path.relative(CONTENT_DIR, filePath),
      pathwayId: pathway.pathway_id,
      issue: `Growth rate ${pathway.growth_rate}% seems unrealistic - verify data source`
    });
  }
}

/**
 * Cross-validate content consistency
 */
async function validateConsistency(results) {
  console.log('🔄 Validating cross-content consistency...');
  
  try {
    // Check if compiled data exists to validate against
    const questionsPath = path.join(DATA_DIR, 'questions.json');
    const pathwaysPath = path.join(DATA_DIR, 'pathways.json');
    
    const questionsExist = await fs.access(questionsPath).then(() => true).catch(() => false);
    const pathwaysExist = await fs.access(pathwaysPath).then(() => true).catch(() => false);
    
    if (questionsExist && pathwaysExist) {
      const questions = JSON.parse(await fs.readFile(questionsPath, 'utf-8'));
      const pathways = JSON.parse(await fs.readFile(pathwaysPath, 'utf-8'));
      
      await validatePathwayQuestionAlignment(questions, pathways, results);
    }
    
  } catch (error) {
    results.consistency.errors.push({
      issue: 'Cross-validation failed',
      error: error.message
    });
  }
}

/**
 * Validate pathway and question alignment
 */
async function validatePathwayQuestionAlignment(questions, pathways, results) {
  const pathwayIds = new Set(pathways.map(p => p.pathway_id || p.fileName));
  const questionPathways = new Set();
  
  // Collect all pathways referenced in questions
  questions.forEach(question => {
    if (question.pathwayScoring) {
      Object.keys(question.pathwayScoring).forEach(pathway => {
        questionPathways.add(pathway.trim());
      });
    }
  });
  
  // Check for pathways in questions but not in pathway files
  questionPathways.forEach(pathway => {
    if (!pathwayIds.has(pathway)) {
      results.consistency.warnings.push({
        issue: 'Missing pathway definition',
        details: `Pathway "${pathway}" is referenced in questions but no pathway file exists`
      });
    }
  });
  
  // Check for pathways defined but not referenced in questions
  pathwayIds.forEach(pathway => {
    if (!questionPathways.has(pathway)) {
      results.consistency.warnings.push({
        issue: 'Unreferenced pathway',
        details: `Pathway "${pathway}" is defined but not referenced in any questions`
      });
    }
  });
}

/**
 * Generate validation report
 */
function generateValidationReport(results) {
  console.log('\n📊 VALIDATION REPORT');
  console.log('==================');
  
  // Questions summary
  console.log(`\n📝 Questions: ${results.questions.valid} valid, ${results.questions.invalid} invalid`);
  if (results.questions.errors.length > 0) {
    console.log('\n❌ Question Errors:');
    results.questions.errors.forEach(error => {
      console.log(`  📄 ${error.file}${error.questionId ? ` (${error.questionId})` : ''}:`);
      if (Array.isArray(error.errors)) {
        error.errors.forEach(err => console.log(`    - ${err}`));
      } else {
        console.log(`    - ${error.error}`);
      }
    });
  }
  
  // Pathways summary
  console.log(`\n🛤️  Pathways: ${results.pathways.valid} valid, ${results.pathways.invalid} invalid`);
  if (results.pathways.errors.length > 0) {
    console.log('\n❌ Pathway Errors:');
    results.pathways.errors.forEach(error => {
      console.log(`  📄 ${error.file}${error.pathwayId ? ` (${error.pathwayId})` : ''}:`);
      if (Array.isArray(error.errors)) {
        error.errors.forEach(err => console.log(`    - ${err}`));
      } else {
        console.log(`    - ${error.error}`);
      }
    });
  }
  
  // Consistency warnings
  if (results.consistency.warnings.length > 0) {
    console.log('\n⚠️  Consistency Warnings:');
    results.consistency.warnings.forEach(warning => {
      console.log(`  📄 ${warning.file || 'General'}${warning.questionId || warning.pathwayId ? ` (${warning.questionId || warning.pathwayId})` : ''}:`);
      console.log(`    - ${warning.issue || warning.details}`);
    });
  }
  
  // Consistency errors
  if (results.consistency.errors.length > 0) {
    console.log('\n❌ Consistency Errors:');
    results.consistency.errors.forEach(error => {
      console.log(`  - ${error.issue}: ${error.error || error.details}`);
    });
  }
  
  console.log('\n==================');
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node validate-content.js [options]

Options:
  --help, -h     Show this help message
  --questions    Validate only questions
  --pathways     Validate only pathways
  --strict       Treat warnings as errors

Examples:
  node validate-content.js                    # Validate all content
  node validate-content.js --questions        # Validate only questions
  node validate-content.js --pathways         # Validate only pathways
  node validate-content.js --strict           # Strict validation mode
`);
    process.exit(0);
  }
  
  validateContent().catch(console.error);
}

module.exports = {
  validateContent,
  validateQuestions,
  validatePathways
};
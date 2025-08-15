#!/usr/bin/env node

/**
 * JSON to Markdown Converter
 * Converts compiled JSON data back to editable Markdown format
 * Useful for editing existing content or migrating data
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const CONTENT_DIR = path.join(__dirname, '../content');

/**
 * Main conversion function
 */
async function convertJsonToMarkdown() {
  console.log('📝 Converting JSON to Markdown...');
  
  try {
    await convertQuestionsToMarkdown();
    await convertPathwaysToMarkdown();
    
    console.log('✅ JSON to Markdown conversion completed!');
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

/**
 * Convert questions JSON back to Markdown
 */
async function convertQuestionsToMarkdown() {
  console.log('📋 Converting questions to Markdown...');
  
  const questionsPath = path.join(DATA_DIR, 'questions.json');
  
  try {
    const questionsData = JSON.parse(await fs.readFile(questionsPath, 'utf-8'));
    
    // Group questions by category and subcategory
    const groupedQuestions = groupQuestionsByCategory(questionsData);
    
    // Write markdown files for each group
    for (const [category, subcategories] of Object.entries(groupedQuestions)) {
      for (const [subcategory, questions] of Object.entries(subcategories)) {
        await writeQuestionMarkdownFile(category, subcategory, questions);
      }
    }
    
  } catch (error) {
    console.warn('⚠️  Could not convert questions:', error.message);
  }
}

/**
 * Group questions by category and subcategory
 */
function groupQuestionsByCategory(questions) {
  const grouped = {};
  
  for (const question of questions) {
    const { category, subcategory } = question;
    
    if (!grouped[category]) {
      grouped[category] = {};
    }
    
    if (!grouped[category][subcategory]) {
      grouped[category][subcategory] = [];
    }
    
    grouped[category][subcategory].push(question);
  }
  
  return grouped;
}

/**
 * Write question markdown file
 */
async function writeQuestionMarkdownFile(category, subcategory, questions) {
  const categoryDir = path.join(CONTENT_DIR, 'questions', category);
  await ensureDirectory(categoryDir);
  
  const filename = path.join(categoryDir, `${subcategory}.md`);
  
  let markdown = generateQuestionFileHeader(category, subcategory);
  
  // Add each question
  questions.forEach((question, index) => {
    markdown += generateQuestionSection(question, index + 1);
  });
  
  // Add scoring and validation info if available
  if (questions.length > 0 && questions[0].validation) {
    markdown += generateScoringSection(questions);
  }
  
  await fs.writeFile(filename, markdown);
  console.log(`📄 Generated: ${category}/${subcategory}.md`);
}

/**
 * Generate question file header
 */
function generateQuestionFileHeader(category, subcategory) {
  const categoryTitles = {
    'holland-code': 'Holland Code Assessment',
    'science-identity': 'Science Identity Scale',
    'values': 'Career Values Assessment',
    'self-efficacy': 'Science Self-Efficacy Scale'
  };
  
  const subcategoryTitles = {
    'realistic': 'Realistic (R) Questions',
    'investigative': 'Investigative (I) Questions',
    'artistic': 'Artistic (A) Questions',
    'social': 'Social (S) Questions',
    'enterprising': 'Enterprising (E) Questions',
    'conventional': 'Conventional (C) Questions',
    'exploration': 'Exploration Dimension',
    'commitment': 'Commitment Dimension'
  };
  
  const title = subcategoryTitles[subcategory] || `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Questions`;
  const parentTitle = categoryTitles[category] || category;
  
  return `# ${title} - Earth Science Assessment\n\n*Part of the ${parentTitle} for Earth Science career pathways.*\n\n`;\n}

/**
 * Generate individual question section
 */
function generateQuestionSection(question, number) {
  let section = `## Question ${number}\n`;
  
  // Add YAML frontmatter block
  section += '```yaml\n';
  section += `id: ${question.id}\n`;
  section += `category: ${question.category}\n`;
  if (question.subcategory) section += `subcategory: ${question.subcategory}\n`;
  section += `weight: ${question.weight}\n`;
  section += `type: ${question.type}\n`;
  if (question.researchSource) section += `research_source: "${question.researchSource}"\n`;
  if (question.validation) section += `validation: "${question.validation}"\n`;
  section += '```\n\n';
  
  // Add question text
  section += `**Question Text**: ${question.text}\n\n`;
  
  // Add response scale
  if (question.responseOptions && question.responseOptions.length > 0) {
    section += '**Response Scale**:\n';
    question.responseOptions.forEach(option => {
      section += `${option.value}. ${option.label}\n`;
    });
    section += '\n';
  }
  
  // Add pathway scoring
  if (question.pathwayScoring && Object.keys(question.pathwayScoring).length > 0) {
    section += '**Pathway Scoring**:\n';
    Object.entries(question.pathwayScoring).forEach(([pathway, score]) => {
      section += `- ${pathway}: ${score}\n`;
    });
    section += '\n';
  }
  
  section += '---\n\n';
  
  return section;
}

/**
 * Generate scoring section for questions
 */
function generateScoringSection(questions) {
  const firstQuestion = questions[0];
  if (!firstQuestion.validation) return '';
  
  let section = '## Scoring Algorithm\n\n';
  section += `**Validation Data**: ${firstQuestion.validation}\n\n`;
  
  // Add scoring notes if available
  section += '**Scoring Notes**: \n';
  section += '- Responses are on a 5-point Likert scale\n';
  section += '- Scores are weighted by question importance\n';
  section += '- Results contribute to overall pathway matching\n\n';
  
  return section;
}

/**
 * Convert pathways JSON back to Markdown
 */
async function convertPathwaysToMarkdown() {
  console.log('🛤️  Converting pathways to Markdown...');
  
  const pathwaysPath = path.join(DATA_DIR, 'pathways.json');
  
  try {
    const pathwaysData = JSON.parse(await fs.readFile(pathwaysPath, 'utf-8'));
    
    // Group pathways by category
    const groupedPathways = {};
    pathwaysData.forEach(pathway => {
      const category = pathway.category || 'other';
      if (!groupedPathways[category]) {
        groupedPathways[category] = [];
      }
      groupedPathways[category].push(pathway);
    });
    
    // Write markdown files for each pathway
    for (const [category, pathways] of Object.entries(groupedPathways)) {
      for (const pathway of pathways) {
        await writePathwayMarkdownFile(category, pathway);
      }
    }
    
  } catch (error) {
    console.warn('⚠️  Could not convert pathways:', error.message);
  }
}

/**
 * Write pathway markdown file
 */
async function writePathwayMarkdownFile(category, pathway) {
  const categoryDir = path.join(CONTENT_DIR, 'pathways', category);
  await ensureDirectory(categoryDir);
  
  const filename = path.join(categoryDir, `${pathway.fileName || pathway.pathway_id}.md`);
  
  let markdown = '';
  
  // Add title
  markdown += `# ${pathway.title}\n\n`;
  
  // Add YAML frontmatter
  if (pathway.pathway_id || pathway.holland_codes || pathway.growth_rate) {
    markdown += '```yaml\n';
    if (pathway.pathway_id) markdown += `pathway_id: ${pathway.pathway_id}\n`;
    if (pathway.category) markdown += `category: ${pathway.category}\n`;
    if (pathway.holland_codes) markdown += `holland_codes: [${pathway.holland_codes.join(', ')}]\n`;
    if (pathway.primary_interests) markdown += `primary_interests: [${pathway.primary_interests.join(', ')}]\n`;
    if (pathway.growth_rate) markdown += `growth_rate: ${pathway.growth_rate}\n`;
    if (pathway.last_updated) markdown += `last_updated: "${pathway.last_updated}"\n`;
    markdown += '```\n\n';
  }
  
  // Use existing content if available, otherwise generate from structured data
  if (pathway.content) {
    markdown += pathway.content;
  } else {
    markdown += generatePathwayContent(pathway);
  }
  
  await fs.writeFile(filename, markdown);
  console.log(`📄 Generated: ${category}/${pathway.fileName || pathway.pathway_id}.md`);
}

/**
 * Generate pathway content from structured data
 */
function generatePathwayContent(pathway) {
  let content = '';
  
  if (pathway.overview) {
    content += '## Overview\n\n';
    content += pathway.overview + '\n\n';
  }
  
  if (pathway.careerProgression) {
    content += '## Career Progression\n\n';
    if (typeof pathway.careerProgression === 'string') {
      content += pathway.careerProgression + '\n\n';
    } else {
      content += JSON.stringify(pathway.careerProgression, null, 2) + '\n\n';
    }
  }
  
  if (pathway.education) {
    content += '## Educational Requirements\n\n';
    if (typeof pathway.education === 'string') {
      content += pathway.education + '\n\n';
    } else {
      content += JSON.stringify(pathway.education, null, 2) + '\n\n';
    }
  }
  
  if (pathway.skills) {
    content += '## Skills Development\n\n';
    if (typeof pathway.skills === 'string') {
      content += pathway.skills + '\n\n';
    } else {
      content += JSON.stringify(pathway.skills, null, 2) + '\n\n';
    }
  }
  
  if (pathway.outlook) {
    content += '## Job Market Outlook\n\n';
    if (typeof pathway.outlook === 'string') {
      content += pathway.outlook + '\n\n';
    } else {
      content += JSON.stringify(pathway.outlook, null, 2) + '\n\n';
    }
  }
  
  return content;
}

/**
 * Ensure directory exists
 */
async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node json-to-md.js [options]

Options:
  --help, -h     Show this help message
  --questions    Convert only questions
  --pathways     Convert only pathways

Examples:
  node json-to-md.js                    # Convert all content
  node json-to-md.js --questions        # Convert only questions
  node json-to-md.js --pathways         # Convert only pathways
`);
    process.exit(0);
  }
  
  convertJsonToMarkdown().catch(console.error);
}

module.exports = {
  convertJsonToMarkdown,
  convertQuestionsToMarkdown,
  convertPathwaysToMarkdown
};
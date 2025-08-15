#!/usr/bin/env node

/**
 * Content Compilation Tool
 * Converts Markdown content files to JSON for runtime use
 * Handles questions, pathways, and scoring matrices
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_DIR = path.join(__dirname, '../src/data');

/**
 * Main compilation function
 */
async function compileContent() {
  console.log('🚀 Starting content compilation...');
  
  try {
    // Ensure output directory exists
    await ensureDirectory(OUTPUT_DIR);
    
    // Compile different content types
    const questions = await compileQuestions();
    const pathways = await compilePathways();
    const scoringMatrix = await compileScoringMatrix();
    
    // Write compiled data
    await writeCompiledData('questions.json', questions);
    await writeCompiledData('pathways.json', pathways);
    await writeCompiledData('scoring-matrix.json', scoringMatrix);
    
    console.log('✅ Content compilation completed successfully!');
    console.log(`📊 Compiled: ${questions.length} questions, ${pathways.length} pathways`);
    
  } catch (error) {
    console.error('❌ Compilation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Compile question files from Markdown to structured JSON
 */
async function compileQuestions() {
  console.log('📝 Compiling questions...');
  
  const questionCategories = ['holland-code', 'science-identity', 'values', 'self-efficacy'];
  const allQuestions = [];
  
  for (const category of questionCategories) {
    const categoryPath = path.join(CONTENT_DIR, 'questions', category);
    
    try {
      const files = await fs.readdir(categoryPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      for (const file of mdFiles) {
        const filePath = path.join(categoryPath, file);
        const subcategory = path.basename(file, '.md');
        
        const questions = await parseQuestionFile(filePath, category, subcategory);
        allQuestions.push(...questions);
      }
    } catch (error) {
      console.warn(`⚠️  Warning: Could not read category ${category}:`, error.message);
    }
  }
  
  return allQuestions;
}

/**
 * Parse individual question file
 */
async function parseQuestionFile(filePath, category, subcategory) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data: frontMatter, content: markdownContent } = matter(content);
  
  const questions = [];
  
  // Split content by question sections (## Question N)
  const questionSections = markdownContent.split(/(?=## Question \d+)/);
  
  for (const section of questionSections) {
    if (!section.trim() || !section.includes('## Question')) continue;
    
    const question = parseQuestionSection(section, category, subcategory);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Parse individual question section
 */
function parseQuestionSection(section, category, subcategory) {
  const lines = section.split('\n');
  const question = {
    category,
    subcategory,
    id: null,
    text: null,
    type: null,
    weight: 1.0,
    researchSource: null,
    responseOptions: [],
    pathwayScoring: {},
    validation: null
  };
  
  let currentBlock = null;
  let yamlBlock = '';
  let inYamlBlock = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Handle YAML frontmatter blocks
    if (trimmedLine === '```yaml') {
      inYamlBlock = true;
      yamlBlock = '';
      continue;
    }
    
    if (trimmedLine === '```' && inYamlBlock) {
      inYamlBlock = false;
      const yamlData = parseInlineYAML(yamlBlock);
      Object.assign(question, yamlData);
      continue;
    }
    
    if (inYamlBlock) {
      yamlBlock += line + '\n';
      continue;
    }
    
    // Extract question text
    if (trimmedLine.startsWith('**Question Text**:')) {
      question.text = trimmedLine.replace('**Question Text**:', '').trim();
    }
    
    // Extract response scale
    if (trimmedLine.match(/^\d+\./)) {
      question.responseOptions.push({
        value: parseInt(trimmedLine.charAt(0)),
        label: trimmedLine.substring(3).trim()
      });
    }
    
    // Extract pathway scoring
    if (trimmedLine.startsWith('- ') && trimmedLine.includes(':')) {
      const [pathway, score] = trimmedLine.substring(2).split(':');
      question.pathwayScoring[pathway.trim()] = parseFloat(score.trim());
    }
  }
  
  return question.id ? question : null;
}

/**
 * Parse inline YAML blocks
 */
function parseInlineYAML(yamlString) {
  const result = {};
  const lines = yamlString.split('\n');
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, value] = line.split(':');
      const cleanKey = key.trim();
      const cleanValue = value.trim().replace(/['"]/g, '');
      
      // Handle different value types
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
 * Compile pathway files
 */
async function compilePathways() {
  console.log('🛤️  Compiling pathways...');
  
  const pathwayCategories = ['traditional', 'emerging'];
  const allPathways = [];
  
  for (const category of pathwayCategories) {
    const categoryPath = path.join(CONTENT_DIR, 'pathways', category);
    
    try {
      const files = await fs.readdir(categoryPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      for (const file of mdFiles) {
        const filePath = path.join(categoryPath, file);
        const pathway = await parsePathwayFile(filePath, category);
        if (pathway) {
          allPathways.push(pathway);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Warning: Could not read pathway category ${category}:`, error.message);
    }
  }
  
  return allPathways;
}

/**
 * Parse pathway file
 */
async function parsePathwayFile(filePath, category) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data: frontMatter, content: markdownContent } = matter(content);
  
  // Parse YAML frontmatter if exists
  let pathwayData = { category };
  if (markdownContent.includes('```yaml')) {
    const yamlMatch = markdownContent.match(/```yaml\n([\s\S]*?)\n```/);
    if (yamlMatch) {
      pathwayData = { ...pathwayData, ...parseInlineYAML(yamlMatch[1]) };
    }
  }
  
  // Extract key information sections
  const sections = parseMarkdownSections(markdownContent);
  
  return {
    ...pathwayData,
    fileName: path.basename(filePath, '.md'),
    title: extractTitle(markdownContent),
    overview: sections.overview || sections.Overview || '',
    careerProgression: sections['Career Progression Pathways'] || sections.careerProgression || {},
    education: sections['Educational Requirements'] || sections.education || {},
    skills: sections['Skills Development Recommendations'] || sections.skills || {},
    outlook: sections['Job Market Outlook'] || sections.outlook || {},
    content: markdownContent
  };
}

/**
 * Parse markdown into sections
 */
function parseMarkdownSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      
      // Start new section
      currentSection = line.substring(3).trim();
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Save final section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

/**
 * Extract title from markdown
 */
function extractTitle(content) {
  const titleMatch = content.match(/^# (.+)$/m);
  return titleMatch ? titleMatch[1] : 'Untitled Pathway';
}

/**
 * Compile scoring matrix (placeholder - would be expanded)
 */
async function compileScoringMatrix() {
  console.log('🎯 Compiling scoring matrix...');
  
  // This would be expanded to read scoring configuration from markdown files
  return {
    hollandCodeWeights: {
      realistic: 1.1,
      investigative: 1.2,
      artistic: 1.0,
      social: 1.05,
      enterprising: 1.0,
      conventional: 1.0
    },
    pathwayMatchingWeights: {
      interests: 0.4,
      identity: 0.25,
      selfEfficacy: 0.2,
      values: 0.1,
      knowledge: 0.05
    }
  };
}

/**
 * Write compiled data to JSON file
 */
async function writeCompiledData(filename, data) {
  const outputPath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  console.log(`📄 Written: ${filename}`);
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

// Run compilation if this script is executed directly
if (require.main === module) {
  compileContent().catch(console.error);
}

module.exports = {
  compileContent,
  compileQuestions,
  compilePathways
};
# Content Editing Guide

*A non-technical guide to editing Earth Science Quiz content using Markdown files*

## Overview

This guide helps educators, researchers, and content experts edit quiz questions, career pathways, and assessment logic without needing programming knowledge. All content is stored in easy-to-edit Markdown files that get automatically converted to the format needed by the quiz application.

## Quick Start

1. **Find the content you want to edit** in the `content/` folder
2. **Edit the Markdown file** using any text editor
3. **Run the build command** to update the quiz
4. **Test your changes** using the validation tool

## Folder Structure

```
content/
├── questions/           # All quiz questions
│   ├── holland-code/   # Interest-based questions
│   ├── science-identity/  # Science engagement questions
│   ├── values/         # Career values questions
│   └── self-efficacy/  # Confidence/skills questions
└── pathways/           # Career pathway information
    ├── traditional/    # Established Earth Science careers
    └── emerging/       # New and growing career areas
```

## Editing Questions

### Question File Format

Each question file contains multiple questions in a standard format:

```markdown
# Question Category Title

## Question 1
```yaml
id: realistic_01
category: hands_on_work
weight: 1.1
type: likert_5
research_source: "Holland (1997) Career Assessment Research"
```

**Question Text**: I enjoy working with my hands to build or fix things outdoors

**Response Scale**:
1. Strongly Dislike
2. Dislike
3. Neutral
4. Like
5. Strongly Like

**Pathway Scoring**:
- Field Geology: 0.9
- Environmental Science: 0.7
- Hydrology: 0.8

---
```

### Question Components Explained

#### YAML Block (Configuration)
The section between ```yaml and ``` contains technical settings:

- **id**: Unique identifier (use format: `category_##`)
- **category**: Type of question (don't change existing ones)
- **weight**: Importance (1.0 = normal, 1.2 = more important, 0.8 = less important)
- **type**: Answer format (`likert_5` for 1-5 scales, `multiple_choice`, etc.)
- **research_source**: Academic citation supporting the question

#### Question Text
The actual question students will see. Keep it:
- Clear and concise (under 100 words)
- Appropriate for high school students
- Free of jargon or technical terms
- Focused on one concept

#### Response Scale
The answer choices students can select. For Likert scales:
- Use consistent language (Strongly Dislike → Strongly Like)
- Provide clear middle option (Neutral, Undecided)
- Match the scale to the question type

#### Pathway Scoring
How much each answer influences career recommendations:
- **0.0 - 0.3**: Low relevance to this career
- **0.4 - 0.6**: Moderate relevance
- **0.7 - 0.9**: High relevance  
- **1.0**: Critical for this career
- Include 5-10 pathways per question for good coverage

### Adding New Questions

1. **Choose the right category** (holland-code, science-identity, etc.)
2. **Open the appropriate subcategory file** (realistic.md, investigative.md, etc.)
3. **Copy an existing question** as a template
4. **Update all components**:
   - Change the ID number (use next sequential number)
   - Write new question text
   - Adjust pathway scoring as needed
   - Add research source if available
5. **Save the file**
6. **Run validation** to check for errors

### Common Question Types

#### Likert Scale Questions (likert_5)
For measuring agreement, interest, or confidence:
```markdown
**Question Text**: I enjoy analyzing complex scientific data

**Response Scale**:
1. Strongly Disagree
2. Disagree  
3. Neutral
4. Agree
5. Strongly Agree
```

#### Multiple Choice Questions
For knowledge or preference assessment:
```markdown
**Question Text**: Which work environment appeals to you most?

**Response Options**:
1. Laboratory setting
2. Outdoor fieldwork
3. Office-based analysis
4. Mixed environments
```

### Question Writing Guidelines

#### Do:
- **Use active voice**: "I enjoy..." not "Scientific data analysis is enjoyable"
- **Be specific**: "analyzing climate data" vs. "working with information"
- **Consider diversity**: Include questions that appeal to different backgrounds
- **Test readability**: Ask a high school student if they understand

#### Don't:
- **Use technical jargon**: "I like sedimentological analysis" → "I enjoy studying rock layers"
- **Ask leading questions**: "Don't you think climate change is important?"
- **Create bias**: Questions that favor one group over another
- **Overlap too much**: Each question should assess something unique

## Editing Career Pathways

### Pathway File Format

Each career pathway is a comprehensive Markdown document:

```markdown
# Career Title

```yaml
pathway_id: geology
category: traditional
holland_codes: [R, I, C]
primary_interests: [field_work, problem_solving]
growth_rate: 5.0
last_updated: "2024-01-15"
```

## Overview

Brief description of the career field...

## Career Progression Pathways

### Entry-Level Positions
- Job titles, salaries, requirements...

### Mid-Level Positions  
- Advanced roles and responsibilities...

## Educational Requirements
- Degree programs, courses, certifications...

## Skills Development Recommendations
- Technical and professional skills...
```

### Pathway Components Explained

#### YAML Configuration
- **pathway_id**: Short identifier (no spaces, use underscores)
- **category**: `traditional`, `emerging`, or `interdisciplinary`
- **holland_codes**: Personality types that fit (R=Realistic, I=Investigative, etc.)
- **primary_interests**: Key activities or interests
- **growth_rate**: Job market growth percentage
- **last_updated**: Date of last major update

#### Content Sections
- **Overview**: 2-3 paragraph summary of the field
- **Career Progression**: Entry → Mid → Senior level positions
- **Educational Requirements**: Degrees, courses, certifications
- **Skills Development**: What students should learn
- **Job Market Outlook**: Growth trends, opportunities

### Updating Pathway Information

#### Salary Data
- Use current data from Bureau of Labor Statistics, Indeed, or Glassdoor
- Provide ranges rather than specific numbers
- Include geographic variations when relevant
- Update annually or when major changes occur

#### Job Growth Rates
- Source from BLS Occupational Outlook Handbook
- Include time frame (e.g., "2022-2032")
- Explain factors driving growth or decline
- Consider automation and technology impacts

#### Educational Requirements
- Verify with university programs
- Include alternative pathways (community college, bootcamps)
- List both required and recommended courses
- Update when accreditation standards change

### Adding New Pathways

1. **Research the career thoroughly**
   - Job descriptions and requirements
   - Salary data and growth projections  
   - Educational pathways and certifications
   - Industry trends and challenges

2. **Create the file**
   - Use the template format
   - Choose appropriate category folder
   - Name file with career title (use hyphens: climate-data-science.md)

3. **Complete all sections**
   - Write for high school student audience
   - Include specific examples and details
   - Provide actionable next steps
   - Cite data sources

4. **Update question scoring**
   - Review existing questions
   - Add your new pathway to relevant pathway scoring sections
   - Ensure scoring reflects how well each question predicts success

## Content Management Commands

### Building Content
Convert Markdown files to JSON format used by the quiz:
```bash
npm run compile-content
```

### Validating Content
Check for errors and consistency issues:
```bash
npm run validate-content
```

### Converting Between Formats
If you need to work with JSON data directly:
```bash
# Convert JSON back to Markdown (for editing)
npm run content:json-to-md

# Convert Markdown to JSON (done automatically during build)
npm run content:md-to-json
```

## Quality Assurance

### Before Publishing Changes

1. **Run validation** to check for technical errors
2. **Review content** for:
   - Spelling and grammar
   - Age-appropriate language
   - Factual accuracy
   - Bias or exclusionary language
3. **Test with sample users** if possible
4. **Check cross-references** between questions and pathways

### Common Validation Errors

#### Question Errors
- **Missing required fields**: All questions need ID, text, type, response options
- **Invalid IDs**: Must follow format like `realistic_01`
- **Scoring out of range**: Pathway scores must be 0.0-1.0
- **Missing pathways**: Questions should score 5+ career pathways

#### Pathway Errors
- **Missing sections**: All pathways need overview, progression, education, skills
- **Invalid growth rates**: Should be realistic (-5% to +30%)
- **Broken links**: External URLs should be current and accessible
- **Inconsistent formatting**: Use the same structure across all pathway files

### Content Review Checklist

- [ ] **Accuracy**: All facts, figures, and requirements are current
- [ ] **Completeness**: All required sections are filled out thoroughly
- [ ] **Clarity**: Language is appropriate for high school students
- [ ] **Consistency**: Formatting and structure match other files
- [ ] **Bias Check**: Content is inclusive and doesn't favor specific groups
- [ ] **Citations**: Data sources are provided and credible
- [ ] **Validation**: Content passes automated validation checks

## Getting Help

### Common Issues

**Q: My changes aren't showing in the quiz**
A: Run `npm run compile-content` to rebuild the content files

**Q: Validation fails with "Invalid ID" error**
A: Check that question IDs follow the format: `category_##` (e.g., `realistic_03`)

**Q: How do I know what pathways to include in question scoring?**
A: Look at existing questions in the same category and include similar pathways, plus any new ones that are relevant

**Q: What if I want to add a completely new career category?**
A: This requires technical changes to the scoring algorithm. Contact the development team.

### Resources

- **Markdown Guide**: https://www.markdownguide.org/basic-syntax/
- **BLS Occupational Outlook**: https://www.bls.gov/ooh/
- **Holland Code Reference**: Search "RIASEC career types" for background information
- **Earth Science Careers**: American Geosciences Institute career resources

### Contact

For technical support or questions about content strategy:
- **GitHub Issues**: [Report problems or suggestions](https://github.com/kevinhaoaus/geo-pathways/issues)
- **Content Questions**: Tag your issues with "content" label
- **Technical Issues**: Tag with "bug" or "development" label

---

## Appendix: File Templates

### New Question Template

```markdown
## Question [NUMBER]
```yaml
id: [category]_[##]
category: [hands_on_work/problem_solving/etc]
weight: 1.0
type: likert_5
research_source: "[Citation if available]"
```

**Question Text**: [Your question here]

**Response Scale**:
1. Strongly Dislike
2. Dislike
3. Neutral
4. Like
5. Strongly Like

**Pathway Scoring**:
- [Career 1]: [0.0-1.0]
- [Career 2]: [0.0-1.0]
- [Career 3]: [0.0-1.0]
- [Career 4]: [0.0-1.0]
- [Career 5]: [0.0-1.0]

---
```

### New Pathway Template

```markdown
# [Career Title]

```yaml
pathway_id: [career_name_no_spaces]
category: [traditional/emerging]
holland_codes: [R, I, A, S, E, C - pick 1-3]
primary_interests: [interest1, interest2, interest3]
growth_rate: [number from BLS]
last_updated: "[YYYY-MM-DD]"
data_sources:
  - "[Source 1]"
  - "[Source 2]"
```

## Overview

[2-3 paragraphs describing what this career involves, why it's important, and what kinds of problems professionals solve]

## Career Progression Pathways

### Entry-Level Positions
[Job titles, salary ranges, education requirements, key responsibilities]

### Mid-Level Positions  
[Advanced roles, leadership opportunities, specialization options]

### Senior-Level Positions
[Executive/expert roles, consulting opportunities, career peaks]

## Educational Requirements

### Undergraduate Foundation
[Required courses, degree programs, important skills to develop]

### Advanced Education Options
[Graduate programs, certifications, alternative pathways]

## Skills Development Recommendations

### Technical Skills
[Software, equipment, methodologies students should learn]

### Professional Skills  
[Communication, leadership, business skills needed]

## Job Market Outlook

[Growth projections, salary trends, geographic opportunities, industry challenges and opportunities]
```

This guide provides everything needed for non-technical users to effectively edit and maintain the quiz content while ensuring quality and consistency.
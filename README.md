# Earth Science Career Pathways Quiz

A comprehensive, scientifically-validated career assessment tool for high school students exploring Earth Science pathways. Built with Next.js, TypeScript, and a human-friendly content management system.

## 🌍 Overview

This assessment combines validated psychological instruments to match students with Earth Science career paths, from traditional geology to emerging climate technology fields. The tool integrates:

- **Holland Code (RIASEC)** interest assessment with Earth Science weighting
- **Science Identity** exploration and commitment scales
- **Self-Efficacy** assessment across skill levels
- **Career Values** alignment matching
- **85+ Career Pathways** with detailed information and requirements

## ✨ Key Features

### For Students
- **Interactive Assessment**: 120 research-backed questions across multiple dimensions
- **Personalized Results**: Detailed career matches with confidence levels
- **Educational Pathways**: Clear roadmaps from high school to career
- **Accessible Design**: WCAG 2.1 AA compliant, mobile-responsive
- **Session Persistence**: Resume assessment anytime within 24 hours

### For Educators & Content Managers
- **Human-Editable Content**: Markdown-first content management system
- **Easy Updates**: No programming knowledge required to edit questions or pathways
- **Content Validation**: Automated checks for data integrity and consistency
- **Research Citations**: Built-in support for academic sourcing
- **Version Control**: Git-friendly content structure

### For Developers & Institutions
- **WordPress Integration**: Embeddable iframe widget with shortcode support
- **Vercel Deployment**: Optimized for serverless deployment
- **Analytics Ready**: Built-in tracking for completion rates and effectiveness
- **FERPA Compliant**: Privacy-first data handling
- **Theme Customization**: Configurable styling for institutional branding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kevinhaoaus/geo-pathways.git
cd geo-pathways
```

2. **Install dependencies**
```bash
npm install
```

3. **Compile content from Markdown to JSON**
```bash
npm run compile-content
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Visit `http://localhost:3000`

## 📁 Project Structure

```
geo-pathways/
├── content/                 # Human-editable Markdown content
│   ├── questions/          # Assessment questions
│   │   ├── holland-code/   # Interest-based questions
│   │   ├── science-identity/# Science engagement questions
│   │   ├── values/         # Career values questions
│   │   └── self-efficacy/  # Skills confidence questions
│   └── pathways/           # Career pathway information
│       ├── traditional/    # Established fields (geology, etc.)
│       └── emerging/       # New fields (climate tech, etc.)
│
├── scripts/                # Content management tools
│   ├── compile-content.js  # Markdown → JSON converter
│   ├── json-to-md.js      # JSON → Markdown converter
│   └── validate-content.js # Content validation
│
├── src/                    # Next.js application
│   ├── components/         # React components
│   ├── lib/               # Assessment engine & utilities
│   ├── pages/             # Next.js pages
│   ├── types/             # TypeScript type definitions
│   └── data/              # Compiled JSON data (auto-generated)
│
└── wordpress-plugin/       # WordPress integration (coming soon)
```

## 📝 Content Management

### Editing Questions

Questions are stored in Markdown files under `content/questions/`. Each question follows this format:

```markdown
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
```

### Editing Career Pathways

Career pathways are comprehensive Markdown documents under `content/pathways/`:

```markdown
# Geology Career Pathway

```yaml
pathway_id: geology
category: traditional
holland_codes: [R, I, C]
growth_rate: 5.0
```

## Overview
[Career description...]

## Career Progression Pathways
[Entry, mid, senior level positions...]

## Educational Requirements
[Degree programs and coursework...]
```

### Content Commands

```bash
# Compile Markdown to JSON for the application
npm run compile-content

# Validate content for errors and consistency
npm run validate-content

# Convert JSON back to Markdown (for editing)
npm run content:json-to-md
```

See [CONTENT_EDITING_GUIDE.md](./CONTENT_EDITING_GUIDE.md) for detailed instructions.

## 🧪 Assessment Methodology

### Scientific Foundation

The assessment is built on validated psychological instruments:

- **Holland Code Theory**: 6 personality types (RIASEC) with proven career prediction validity
- **Science Identity Framework**: Exploration and commitment dimensions from developmental psychology
- **Self-Efficacy Theory**: Bandura's framework adapted for Earth Science skills
- **Career Values Research**: Work values that predict job satisfaction and persistence

### Scoring Algorithm

Results combine multiple dimensions using validated weights:

```typescript
matchScore = (
  hollandAlignment × 0.4 +
  identityDevelopment × 0.25 +
  selfEfficacyFit × 0.2 +
  valuesAlignment × 0.1 +
  knowledgeBonus × 0.05
)
```

### Validation Features

- **Content validation** ensures questions are appropriate and research-backed
- **Cross-validation** checks pathway-question alignment
- **Reliability tracking** monitors internal consistency
- **Outcome validation** through longitudinal follow-up (planned)

## 🔌 WordPress Integration

### Shortcode Usage

```php
[earth_science_quiz theme="stanford" save_results="true"]
```

### Iframe Embedding

```html
<iframe 
  src="https://your-quiz-domain.vercel.app/?embedded=true&theme=custom"
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>
```

### Theme Customization

Customize colors and styling through CSS variables:

```css
:root {
  --quiz-primary-color: #0066cc;
  --quiz-secondary-color: #f8f9fa;
  --quiz-accent-color: #28a745;
  --quiz-font-family: 'Inter', sans-serif;
}
```

## 📊 Analytics & Tracking

### Built-in Metrics

- Completion rates by question and section
- Response time patterns
- Most popular career pathways
- Demographic breakdowns (anonymous)
- Long-term outcome tracking

### Privacy Compliance

- **No PII collection** without explicit consent
- **Session-based tracking** with automatic cleanup
- **FERPA compliant** data handling procedures
- **GDPR ready** with consent management
- **Anonymous analytics** for continuous improvement

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Set environment variables** (optional):
   - `ANALYTICS_ID`: Google Analytics ID
   - `QUIZ_TITLE`: Custom title
   - `ENABLE_ANALYTICS`: Enable/disable tracking
4. **Deploy** automatically on push to main

### Manual Deployment

```bash
# Build the application
npm run build

# Export static files (optional)
npm run export

# Deploy to any static hosting service
```

## 🧪 Development

### Testing Content Changes

```bash
# Validate all content
npm run validate-content

# Test specific question categories
npm run validate-content -- --questions

# Run in strict mode (warnings as errors)
npm run validate-content -- --strict
```

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality
npm run type-check   # Verify TypeScript
```

### Adding New Career Pathways

1. Create new Markdown file in appropriate category folder
2. Use pathway template from content guide
3. Add pathway to relevant question scoring sections
4. Validate content and test locally
5. Submit pull request for review

## 📚 Research & Citations

This assessment tool is built on peer-reviewed research:

- Holland, J. L. (1997). *Making vocational choices: A theory of vocational personalities and work environments*
- Carlone, H. B., & Johnson, A. (2007). Understanding the science experiences of successful women of color
- Bandura, A. (2006). Self-efficacy beliefs of adolescents
- American Geosciences Institute (2023). Workforce Survey and Career Resources

## 🤝 Contributing

We welcome contributions from educators, researchers, and developers!

### Content Contributions
- **Question improvements**: Better wording, updated research citations
- **Career pathway updates**: New fields, salary data, educational requirements
- **Research validation**: Academic partnerships and outcome studies

### Technical Contributions
- **Accessibility improvements**: Enhanced screen reader support, keyboard navigation
- **Performance optimization**: Faster loading, better mobile experience
- **Analytics enhancements**: Better tracking, outcome measurement

### Getting Started
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes following our style guidelines
4. Test thoroughly including content validation
5. Submit pull request with detailed description

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/kevinhaoaus/geo-pathways/issues)
- **Discussions**: [Community questions and ideas](https://github.com/kevinhaoaus/geo-pathways/discussions)
- **Documentation**: [Content editing guide](CONTENT_EDITING_GUIDE.md)

## 🗺️ Roadmap

### Phase 1 (Current): Core Assessment ✅
- Multi-dimensional assessment engine
- Content management system
- Basic WordPress integration

### Phase 2 (Q2 2024): Enhanced Features
- PDF report generation
- Advanced analytics dashboard
- Mobile app development
- Improved accessibility features

### Phase 3 (Q3 2024): AI & Personalization
- AI-powered pathway recommendations
- Adaptive questioning based on responses
- Integration with college/university databases
- Longitudinal outcome tracking

### Phase 4 (Q4 2024): Ecosystem Integration
- LMS integration (Canvas, Blackboard, etc.)
- Career counselor dashboard
- Parent/guardian reporting
- Multi-language support

---

**Built with 🌍 for the next generation of Earth scientists**
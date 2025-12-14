# Implementation Plan: Transcript Upload Feature

## Overview

Add the capability for users to upload a sales call transcript and receive methodology recommendations based on AI analysis, as an alternative to the manual questionnaire.

---

## Current State

- **5 questions** collect: `cycle`, `complexity`, `stakeholders`, `priority`, `team`
- **Scoring algorithm** uses these 5 factors to rank 12 methodologies
- **Fully client-side** - no backend, no API calls
- **Deployed on Netlify** as a static site

---

## Proposed Architecture

### Approach: Netlify Functions + AI API

Since the app is already deployed on Netlify, we'll use **Netlify Functions** (serverless) to securely handle AI API calls. This avoids exposing API keys in the client and requires no separate backend infrastructure.

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐         ┌─────────────────────────────┐   │
│  │  Questionnaire  │   OR    │   Transcript Upload         │   │
│  │  (existing)     │         │   (new feature)             │   │
│  └────────┬────────┘         └──────────────┬──────────────┘   │
│           │                                  │                  │
│           │                                  ▼                  │
│           │                  ┌──────────────────────────────┐   │
│           │                  │  Netlify Function            │   │
│           │                  │  /api/analyze-transcript     │   │
│           │                  └──────────────┬───────────────┘   │
│           │                                  │                  │
│           │                                  ▼                  │
│           │                  ┌──────────────────────────────┐   │
│           │                  │  AI API (Claude/OpenAI)      │   │
│           │                  │  Analyze transcript          │   │
│           │                  └──────────────┬───────────────┘   │
│           │                                  │                  │
│           │                                  ▼                  │
│           │                  ┌──────────────────────────────┐   │
│           │                  │  Structured Response:        │   │
│           │                  │  { cycle, complexity,        │   │
│           │                  │    stakeholders, priority,   │   │
│           │                  │    team, analysis }          │   │
│           │                  └──────────────┬───────────────┘   │
│           │                                  │                  │
│           ▼                                  ▼                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              calculateRecommendations()                   │   │
│  │              (existing scoring algorithm)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Results Dashboard                            │   │
│  │              (enhanced with transcript insights)          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature Components

### 1. Entry Point Selection (New View)

A new landing view allowing users to choose their path:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        How would you like to get your recommendation?       │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │                         │  │                         │  │
│  │   📝 Answer Questions   │  │   📄 Upload Transcript  │  │
│  │                         │  │                         │  │
│  │   Quick 5-question      │  │   Upload a sales call   │  │
│  │   assessment            │  │   transcript for AI     │  │
│  │                         │  │   analysis              │  │
│  │   ~2 minutes            │  │   ~30 seconds           │  │
│  │                         │  │                         │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Transcript Upload Interface (New View)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Upload Your Sales Call Transcript              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │     Drag & drop your transcript file here          │   │
│  │                   or                               │   │
│  │            [Choose File]                           │   │
│  │                                                     │   │
│  │     Supported: .txt, .docx, .pdf, .vtt, .srt       │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                        ── OR ──                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │   Paste your transcript text here...               │   │
│  │                                                     │   │
│  │                                                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│            [Back]                    [Analyze Transcript]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Analysis Loading State (New View)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   Analyzing Your Transcript                 │
│                                                             │
│                      ◐ ◓ ◑ ◒ (spinner)                     │
│                                                             │
│         Our AI is reviewing your sales conversation         │
│         to identify the best methodology for you...         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ✓ Extracting sales cycle signals                   │   │
│  │  ✓ Analyzing deal complexity                        │   │
│  │  ◐ Identifying stakeholders mentioned               │   │
│  │  ○ Detecting primary challenges                     │   │
│  │  ○ Assessing seller approach                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Enhanced Results View

The existing results view will be enhanced to show:
- Source indicator (questionnaire vs transcript)
- For transcript analysis: key insights extracted from the call
- Relevant quotes from the transcript supporting the recommendation

```
┌─────────────────────────────────────────────────────────────┐
│  📄 Based on your transcript analysis                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Key Insights from Your Call:                       │   │
│  │                                                     │   │
│  │  • Sales Cycle: Long (6+ months)                    │   │
│  │    "...we're looking at a Q3 implementation..."     │   │
│  │                                                     │   │
│  │  • Complexity: High                                 │   │
│  │    "...need to integrate with SAP and Salesforce..."│   │
│  │                                                     │   │
│  │  • Stakeholders: 7+ people                          │   │
│  │    "...I'll need to loop in our CTO, CFO, and..."   │   │
│  │                                                     │   │
│  │  • Primary Challenge: Qualification                 │   │
│  │    Discussion focused heavily on budget authority   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Existing top 3 recommendations display...]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Tasks

### Phase 1: Infrastructure Setup

#### Task 1.1: Set up Netlify Functions
- Create `netlify/functions/` directory structure
- Configure `netlify.toml` for functions
- Add build configuration

**Files to create/modify:**
- `netlify/functions/analyze-transcript.js`
- `netlify.toml` (update)

#### Task 1.2: Add AI API integration
- Choose AI provider (recommend Claude API for best analysis)
- Set up environment variables for API key
- Create prompt engineering for transcript analysis

**Environment variables needed:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

### Phase 2: Backend API

#### Task 2.1: Create transcript analysis endpoint

**`netlify/functions/analyze-transcript.js`**

The function will:
1. Accept transcript text (POST body)
2. Validate input (length limits, content check)
3. Call AI API with structured prompt
4. Parse AI response into scoring format
5. Return structured JSON

**API Contract:**

Request:
```json
{
  "transcript": "string (the full transcript text)"
}
```

Response:
```json
{
  "success": true,
  "analysis": {
    "cycle": 1 | 2 | 3,
    "complexity": 1 | 2 | 3,
    "stakeholders": 1 | 2 | 3,
    "priority": "qualification" | "discovery" | "differentiation",
    "team": "junior" | "mixed" | "senior",
    "insights": {
      "cycleEvidence": "Quote or reasoning...",
      "complexityEvidence": "Quote or reasoning...",
      "stakeholderEvidence": "Quote or reasoning...",
      "priorityEvidence": "Quote or reasoning...",
      "teamEvidence": "Quote or reasoning...",
      "summary": "Overall analysis summary..."
    },
    "confidence": 0.0 - 1.0
  }
}
```

#### Task 2.2: Create AI prompt template

The prompt must extract:
1. **Sales Cycle Length** - Look for timeline mentions, urgency indicators, follow-up scheduling
2. **Product Complexity** - Technical discussions, integration requirements, customization needs
3. **Stakeholder Count** - Names mentioned, departments referenced, approval chains
4. **Primary Challenge** - Is the conversation focused on qualifying the deal, discovering pain, or differentiating?
5. **Seller Experience** - Based on questioning technique, objection handling, conversation control

**Prompt structure:**
```
You are analyzing a sales call transcript to recommend the best sales methodology.

Analyze the following transcript and extract these factors:

1. SALES CYCLE LENGTH
   - Short (1): Under 60 days, quick decisions, transactional
   - Medium (2): 2-6 months, multiple touchpoints
   - Long (3): 6+ months, enterprise deals

2. PRODUCT/DEAL COMPLEXITY
   - Simple (1): Straightforward, easy to understand
   - Moderate (2): Some customization needed
   - Complex (3): Highly configurable enterprise solution

3. NUMBER OF STAKEHOLDERS
   - Few (1): 1-3 decision makers
   - Medium (2): 4-6 stakeholders
   - Many (3): 7+ people in buying group

4. PRIMARY SALES CHALLENGE OBSERVED
   - qualification: Focus on budget, authority, need, timing
   - discovery: Focus on uncovering pain points and needs
   - differentiation: Focus on standing out from competition

5. SELLER EXPERIENCE LEVEL (inferred from technique)
   - junior: Basic questioning, follows script
   - mixed: Some advanced techniques, inconsistent
   - senior: Sophisticated approach, confident navigation

For each factor, provide:
- Your assessment value
- A brief quote or evidence from the transcript
- Confidence level (low/medium/high)

TRANSCRIPT:
---
{transcript}
---

Respond in JSON format:
{schema}
```

### Phase 3: Frontend Implementation

#### Task 3.1: Add new state management

New state variables:
```javascript
const [inputMode, setInputMode] = useState(null); // 'questionnaire' | 'transcript' | null
const [transcript, setTranscript] = useState('');
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [analysisInsights, setAnalysisInsights] = useState(null);
const [analysisError, setAnalysisError] = useState(null);
```

#### Task 3.2: Create mode selection view

New landing screen with two options:
- Answer Questions (existing flow)
- Upload Transcript (new flow)

#### Task 3.3: Create transcript upload component

Features:
- File drag & drop zone
- File input for click-to-browse
- Text area for paste option
- File type validation (.txt, .docx, .pdf, .vtt, .srt)
- Character count and limit display
- Clear/reset button

#### Task 3.4: Create analysis loading component

Features:
- Animated spinner
- Step-by-step progress indicators
- Estimated time remaining
- Cancel option

#### Task 3.5: Implement file parsing

Handle different file formats:
- `.txt` - Direct read
- `.docx` - Use mammoth.js library
- `.pdf` - Use pdf-parse library (or pdf.js for client-side)
- `.vtt/.srt` - Parse subtitle format, strip timestamps

**New dependencies:**
```json
{
  "mammoth": "^1.6.0"
}
```

Note: For PDF, consider client-side pdf.js to avoid server complexity.

#### Task 3.6: Create API integration service

```javascript
// src/services/transcriptAnalysis.js

export async function analyzeTranscript(transcriptText) {
  const response = await fetch('/.netlify/functions/analyze-transcript', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript: transcriptText })
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}
```

#### Task 3.7: Enhance results view

Add conditional rendering for transcript-based results:
- "Based on your transcript analysis" header
- Insights panel showing extracted evidence
- Confidence indicator
- Option to "Refine with questionnaire" if confidence is low

### Phase 4: Error Handling & Edge Cases

#### Task 4.1: Input validation
- Minimum transcript length (e.g., 500 characters)
- Maximum transcript length (e.g., 100,000 characters / ~20,000 words)
- Empty/whitespace-only detection
- Non-English detection (warn user)

#### Task 4.2: API error handling
- Network failures with retry
- Rate limiting responses
- Timeout handling (30-60 second limit)
- Graceful degradation (offer questionnaire fallback)

#### Task 4.3: Low-confidence handling
- If AI confidence < 50%, suggest using questionnaire instead
- Allow users to override AI assessment for specific factors
- Show "Edit Analysis" option

### Phase 5: Testing & Polish

#### Task 5.1: Test with sample transcripts
- Create 5-10 sample transcripts covering different scenarios
- Test edge cases (short transcripts, non-sales conversations)
- Verify scoring alignment with questionnaire

#### Task 5.2: Performance optimization
- Add loading states
- Implement request debouncing
- Cache recent analyses (session storage)

#### Task 5.3: Mobile responsiveness
- Test file upload on mobile
- Ensure text area is mobile-friendly
- Verify loading states on smaller screens

---

## File Structure (New & Modified)

```
sales-methodology-advisor/
├── netlify/
│   └── functions/
│       └── analyze-transcript.js    [NEW]
├── src/
│   ├── App.jsx                      [MODIFIED - major changes]
│   ├── components/                  [NEW directory]
│   │   ├── ModeSelector.jsx         [NEW]
│   │   ├── TranscriptUpload.jsx     [NEW]
│   │   ├── AnalysisLoading.jsx      [NEW]
│   │   ├── InsightsPanel.jsx        [NEW]
│   │   └── Questionnaire.jsx        [NEW - extracted from App.jsx]
│   ├── services/
│   │   └── transcriptAnalysis.js    [NEW]
│   ├── utils/
│   │   └── fileParser.js            [NEW]
│   ├── index.css
│   └── main.jsx
├── netlify.toml                     [MODIFIED]
├── package.json                     [MODIFIED - new dependencies]
└── .env.example                     [NEW]
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "mammoth": "^1.6.0"
  },
  "devDependencies": {
    "@netlify/functions": "^2.4.0"
  }
}
```

For the Netlify function:
```json
{
  "@anthropic-ai/sdk": "^0.24.0"
}
```

---

## Environment Variables

**Local Development (`.env`):**
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Netlify Dashboard:**
- Add `ANTHROPIC_API_KEY` in Site Settings > Environment Variables

---

## UI/UX Considerations

### Progressive Disclosure
- Don't overwhelm with options on first load
- Clear path selection with visual distinction
- Easy way to switch between modes

### Feedback & Trust
- Show what the AI "saw" in the transcript
- Allow users to correct/override analysis
- Provide confidence indicators

### Error Recovery
- Never lose user's transcript on error
- Offer questionnaire fallback
- Clear error messages with actions

---

## Security Considerations

1. **API Key Protection**: Never expose AI API key in client code
2. **Input Sanitization**: Validate and sanitize transcript input
3. **Rate Limiting**: Implement rate limiting on the Netlify function
4. **Content Filtering**: Reject obviously inappropriate content
5. **Data Privacy**: Don't store transcripts longer than needed for analysis

---

## Cost Estimation

**Claude API (Anthropic):**
- Input: ~$3 / 1M tokens
- Output: ~$15 / 1M tokens
- Average transcript: ~5,000 tokens input, ~500 tokens output
- Cost per analysis: ~$0.02

**Netlify Functions:**
- 125,000 free function invocations/month
- Well within free tier for typical usage

---

## Future Enhancements (Out of Scope)

1. **Audio upload**: Direct audio file processing with Whisper
2. **Integration with call recording tools**: Gong, Chorus, etc.
3. **Batch analysis**: Multiple transcripts at once
4. **Historical tracking**: Save and compare analyses over time
5. **Team analytics**: Aggregate insights across team transcripts

---

## Implementation Order

1. **Phase 1**: Infrastructure (Netlify Functions setup)
2. **Phase 2**: Backend API (transcript analysis endpoint)
3. **Phase 3**: Frontend (step by step)
   - 3.1-3.2: Mode selection and basic transcript input
   - 3.3-3.4: Upload UI and loading states
   - 3.5-3.6: File parsing and API integration
   - 3.7: Enhanced results
4. **Phase 4**: Error handling
5. **Phase 5**: Testing and polish

---

## Success Criteria

- [ ] User can upload a transcript file or paste text
- [ ] AI analyzes transcript and extracts the 5 scoring factors
- [ ] Same recommendation algorithm produces results
- [ ] User sees evidence/quotes supporting the analysis
- [ ] Error states are handled gracefully
- [ ] Mobile experience works well
- [ ] Analysis completes in under 30 seconds
- [ ] Cost per analysis is under $0.05

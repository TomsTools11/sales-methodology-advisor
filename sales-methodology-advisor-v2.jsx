import React, { useState } from 'react';

/*
 * Sales Methodology Advisor
 * Interactive tool for recommending enterprise sales frameworks
 * 
 * Color Palette (Tom Panos Brand):
 * - Deep Navy (bg):     #021A2E
 * - Navy Blue:          #014379
 * - Bright Blue (CTA):  #0D91FD
 * - Sky Blue:           #5DB5FE
 * - Light Blue:         #C2E3FE
 */

const methodologies = [
  {
    id: 'meddic',
    name: 'MEDDIC',
    tagline: 'Rigorous Deal Qualification',
    description: 'A checklist-driven framework for qualifying complex enterprise deals by systematically assessing deal viability.',
    coreElements: ['Metrics', 'Economic Buyer', 'Decision Criteria', 'Decision Process', 'Identify Pain', 'Champion'],
    bestFor: 'Enterprise sales with 5+ stakeholders and long cycles',
    complexity: 'High',
    cycleLength: 'Long (6+ months)',
    approach: 'Systematic qualification assessment',
    category: 'qualification',
    scores: { complexity: 3, cycle: 3, stakeholders: 3, qualification: 3, discovery: 1, differentiation: 1 }
  },
  {
    id: 'meddpicc',
    name: 'MEDDPICC',
    tagline: 'Extended Enterprise Qualification',
    description: 'Enhanced MEDDIC with Paper Process and Competition elements for the most complex deals.',
    coreElements: ['Metrics', 'Economic Buyer', 'Decision Criteria', 'Decision Process', 'Paper Process', 'Identify Pain', 'Champion', 'Competition'],
    bestFor: 'Highly competitive enterprise deals with lengthy procurement',
    complexity: 'Very High',
    cycleLength: 'Long (6+ months)',
    approach: 'Comprehensive multi-factor deal assessment',
    category: 'qualification',
    scores: { complexity: 3, cycle: 3, stakeholders: 3, qualification: 3, discovery: 1, differentiation: 2 }
  },
  {
    id: 'spin',
    name: 'SPIN Selling',
    tagline: 'Strategic Questioning Framework',
    description: 'A consultative questioning sequence that guides prospects to discover their own needs.',
    coreElements: ['Situation Questions', 'Problem Questions', 'Implication Questions', 'Need-Payoff Questions'],
    bestFor: 'Consultative environments requiring deep discovery',
    complexity: 'Medium',
    cycleLength: 'Medium-Long',
    approach: 'Strategic questioning to uncover latent needs',
    category: 'discovery',
    scores: { complexity: 2, cycle: 2, stakeholders: 2, qualification: 2, discovery: 3, differentiation: 2 }
  },
  {
    id: 'challenger',
    name: 'Challenger Sale',
    tagline: 'Teach, Tailor, Take Control',
    description: 'Lead with insights that reframe how prospects think about their business challenges.',
    coreElements: ['Commercial Teaching', 'Tailored Messaging', 'Taking Control', 'Constructive Tension'],
    bestFor: 'Complex B2B where buyers are stuck in status quo',
    complexity: 'High',
    cycleLength: 'Medium-Long',
    approach: 'Insight-led differentiation and reframing',
    category: 'differentiation',
    scores: { complexity: 2, cycle: 2, stakeholders: 2, qualification: 1, discovery: 2, differentiation: 3 }
  },
  {
    id: 'bant',
    name: 'BANT',
    tagline: 'Classic Quick Qualification',
    description: 'The foundational qualification framework for rapidly assessing lead viability.',
    coreElements: ['Budget', 'Authority', 'Need', 'Timeline'],
    bestFor: 'High-volume leads, shorter sales cycles',
    complexity: 'Low',
    cycleLength: 'Short (<60 days)',
    approach: 'Linear qualification checklist',
    category: 'quick',
    scores: { complexity: 1, cycle: 1, stakeholders: 1, qualification: 2, discovery: 1, differentiation: 1 }
  },
  {
    id: 'neat',
    name: 'N.E.A.T.',
    tagline: 'Modern SaaS Qualification',
    description: 'A value-first update to BANT designed for non-linear SaaS buying processes.',
    coreElements: ['Needs (deep)', 'Economic Impact', 'Access to Authority', 'Timeline'],
    bestFor: 'SaaS sales with multiple stakeholders',
    complexity: 'Medium',
    cycleLength: 'Medium',
    approach: 'Value-first, flexible sequencing',
    category: 'quick',
    scores: { complexity: 2, cycle: 2, stakeholders: 2, qualification: 2, discovery: 2, differentiation: 1 }
  },
  {
    id: 'sandler',
    name: 'Sandler Selling',
    tagline: 'Buyer Pursues the Deal',
    description: 'Reframe the sales dynamic so the buyer convinces themselves they need your solution.',
    coreElements: ['Bonding & Rapport', 'Up-Front Contracts', 'Pain Discovery', 'Budget', 'Decision', 'Fulfillment', 'Post-Sell'],
    bestFor: 'Relationship-based selling, longer cycles',
    complexity: 'Medium-High',
    cycleLength: 'Long',
    approach: 'Equal business stature, reverse psychology',
    category: 'relationship',
    scores: { complexity: 2, cycle: 3, stakeholders: 2, qualification: 2, discovery: 2, differentiation: 2 }
  },
  {
    id: 'solution',
    name: 'Solution Selling',
    tagline: 'Diagnose Before Prescribing',
    description: 'Lead with customer problems, not product features. Co-create customized solutions.',
    coreElements: ['Problem Diagnosis', 'Solution Design', 'Value Delivery'],
    bestFor: 'Customizable products requiring tailored approaches',
    complexity: 'Medium',
    cycleLength: 'Medium',
    approach: 'Problem-first, co-creation',
    category: 'discovery',
    scores: { complexity: 2, cycle: 2, stakeholders: 2, qualification: 1, discovery: 3, differentiation: 2 }
  },
  {
    id: 'consultative',
    name: 'Consultative Selling',
    tagline: 'Trusted Advisor Approach',
    description: 'Transform from product pusher to trusted advisor through expert guidance.',
    coreElements: ['Deep Listening', 'Strategic Questioning', 'Expert Guidance', 'Co-Creation'],
    bestFor: 'Long-term relationships, expertise-valued contexts',
    complexity: 'Medium',
    cycleLength: 'Long',
    approach: 'Expert partner, not vendor',
    category: 'relationship',
    scores: { complexity: 2, cycle: 3, stakeholders: 2, qualification: 1, discovery: 3, differentiation: 2 }
  },
  {
    id: 'gap',
    name: 'GAP Selling',
    tagline: 'Visualize the Gap',
    description: 'Focus on the distance between current state and desired future state to create urgency.',
    coreElements: ['Current State Analysis', 'Future State Vision', 'Gap Identification', 'Impact Quantification'],
    bestFor: 'Transformation deals, status quo disruption',
    complexity: 'Medium-High',
    cycleLength: 'Medium-Long',
    approach: 'Make the gap visible and urgent',
    category: 'differentiation',
    scores: { complexity: 2, cycle: 2, stakeholders: 2, qualification: 1, discovery: 3, differentiation: 3 }
  },
  {
    id: 'snap',
    name: 'SNAP Selling',
    tagline: 'Cut Through the Noise',
    description: 'Help overwhelmed buyers by being simple, invaluable, aligned, and priority-focused.',
    coreElements: ['Keep it Simple', 'Be iNvaluable', 'Always Align', 'Raise Priorities'],
    bestFor: 'Crowded markets, time-starved buyers',
    complexity: 'Low-Medium',
    cycleLength: 'Short-Medium',
    approach: 'Reduce friction, stand out',
    category: 'modern',
    scores: { complexity: 1, cycle: 1, stakeholders: 1, qualification: 1, discovery: 1, differentiation: 3 }
  },
  {
    id: 'spiced',
    name: 'SPICED',
    tagline: 'Customer-Centric Framework',
    description: 'A standardized framework focused on achieving ongoing impact over immediate closing.',
    coreElements: ['Situation', 'Pain', 'Impact', 'Critical Event', 'Decision'],
    bestFor: 'B2B with ongoing relationship value',
    complexity: 'Low-Medium',
    cycleLength: 'Short-Medium',
    approach: 'Standardized, easy adoption',
    category: 'quick',
    scores: { complexity: 1, cycle: 1, stakeholders: 2, qualification: 2, discovery: 2, differentiation: 1 }
  }
];

const questions = [
  {
    id: 'cycle',
    question: 'What is your typical sales cycle length?',
    options: [
      { value: 1, label: 'Short (under 60 days)', desc: 'Quick decisions, transactional sales' },
      { value: 2, label: 'Medium (2-6 months)', desc: 'Multiple touchpoints, some complexity' },
      { value: 3, label: 'Long (6+ months)', desc: 'Enterprise deals, many stakeholders' }
    ]
  },
  {
    id: 'complexity',
    question: 'How complex is your product or solution?',
    options: [
      { value: 1, label: 'Simple', desc: 'Straightforward, easy to understand' },
      { value: 2, label: 'Moderate', desc: 'Requires some customization or configuration' },
      { value: 3, label: 'Complex', desc: 'Highly configurable enterprise solution' }
    ]
  },
  {
    id: 'stakeholders',
    question: 'How many stakeholders are typically involved?',
    options: [
      { value: 1, label: '1-3 decision makers', desc: 'Simple buying committee' },
      { value: 2, label: '4-6 stakeholders', desc: 'Cross-functional involvement' },
      { value: 3, label: '7+ people', desc: 'Large enterprise buying groups' }
    ]
  },
  {
    id: 'priority',
    question: 'What is your primary sales challenge?',
    options: [
      { value: 'qualification', label: 'Qualifying leads efficiently', desc: 'Too many bad deals in pipeline' },
      { value: 'discovery', label: 'Understanding customer needs', desc: 'Struggling to uncover real pain' },
      { value: 'differentiation', label: 'Standing out from competition', desc: 'Competing on more than price' }
    ]
  },
  {
    id: 'team',
    question: 'What best describes your sales team?',
    options: [
      { value: 'junior', label: 'Newer to sales', desc: 'Need structured, repeatable processes' },
      { value: 'mixed', label: 'Mixed experience', desc: 'Some veterans, some newer reps' },
      { value: 'senior', label: 'Experienced sellers', desc: 'Can handle nuanced approaches' }
    ]
  }
];

// Category colors for methodology badges
const categoryColors = {
  qualification: { bg: '#014379', text: '#C2E3FE' },
  discovery: { bg: '#0D91FD', text: '#021A2E' },
  differentiation: { bg: '#5DB5FE', text: '#021A2E' },
  relationship: { bg: '#014379', text: '#C2E3FE' },
  quick: { bg: '#C2E3FE', text: '#021A2E' },
  modern: { bg: '#0D91FD', text: '#021A2E' }
};

export default function SalesMethodologyAdvisor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedMethodology, setSelectedMethodology] = useState(null);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRecommendations = () => {
    const scores = methodologies.map(m => {
      let score = 0;
      
      const cycleDiff = Math.abs(m.scores.cycle - (answers.cycle || 2));
      score += (3 - cycleDiff) * 15;
      
      const complexityDiff = Math.abs(m.scores.complexity - (answers.complexity || 2));
      score += (3 - complexityDiff) * 15;
      
      const stakeholderDiff = Math.abs(m.scores.stakeholders - (answers.stakeholders || 2));
      score += (3 - stakeholderDiff) * 12;
      
      if (answers.priority) {
        score += m.scores[answers.priority] * 20;
      }
      
      if (answers.team === 'junior') {
        score += m.scores.complexity === 1 ? 10 : (m.scores.complexity === 2 ? 5 : -5);
      } else if (answers.team === 'senior') {
        score += m.scores.complexity >= 2 ? 8 : 0;
      }
      
      return { ...m, score };
    });
    
    return scores.sort((a, b) => b.score - a.score);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setSelectedMethodology(null);
  };

  const recommendations = showResults ? calculateRecommendations() : [];
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Methodology Detail View
  if (selectedMethodology) {
    const m = methodologies.find(method => method.id === selectedMethodology);
    const catColor = categoryColors[m.category];
    
    return (
      <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#021A2E' }}>
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setSelectedMethodology(null)}
            className="flex items-center gap-2 mb-6 transition-colors"
            style={{ color: '#5DB5FE' }}
            onMouseEnter={(e) => e.target.style.color = '#C2E3FE'}
            onMouseLeave={(e) => e.target.style.color = '#5DB5FE'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Results</span>
          </button>
          
          <div 
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: '#014379', border: '1px solid #0D91FD' }}
          >
            {/* Header */}
            <div className="p-6 pb-4" style={{ borderBottom: '1px solid rgba(13, 145, 253, 0.3)' }}>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>{m.name}</h1>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide"
                  style={{ backgroundColor: catColor.bg, color: catColor.text, border: '1px solid #0D91FD' }}
                >
                  {m.category}
                </span>
              </div>
              <p className="text-lg" style={{ color: '#5DB5FE' }}>{m.tagline}</p>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <h3 
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: '#5DB5FE' }}
                >
                  Overview
                </h3>
                <p className="leading-relaxed" style={{ color: '#C2E3FE' }}>{m.description}</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#021A2E' }}>
                  <p className="text-xs uppercase mb-1" style={{ color: '#5DB5FE' }}>Complexity</p>
                  <p className="font-semibold" style={{ color: '#FFFFFF' }}>{m.complexity}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#021A2E' }}>
                  <p className="text-xs uppercase mb-1" style={{ color: '#5DB5FE' }}>Cycle Length</p>
                  <p className="font-semibold" style={{ color: '#FFFFFF' }}>{m.cycleLength}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#021A2E' }}>
                  <p className="text-xs uppercase mb-1" style={{ color: '#5DB5FE' }}>Best For</p>
                  <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>{m.bestFor}</p>
                </div>
              </div>
              
              {/* Core Elements */}
              <div>
                <h3 
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#5DB5FE' }}
                >
                  Core Elements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {m.coreElements.map((element, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: '#021A2E', color: '#C2E3FE', border: '1px solid #0D91FD' }}
                    >
                      {element}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Approach */}
              <div>
                <h3 
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: '#5DB5FE' }}
                >
                  Approach
                </h3>
                <p style={{ color: '#C2E3FE' }}>{m.approach}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (showResults) {
    const topPicks = recommendations.slice(0, 3);
    const secondary = recommendations.slice(3, 6);
    
    return (
      <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#021A2E' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
              Your Recommended Methodologies
            </h1>
            <p style={{ color: '#5DB5FE' }}>Based on your sales environment and priorities</p>
          </div>
          
          {/* Top Recommendations */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0D91FD' }}></div>
              <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Top Recommendations</h2>
            </div>
            
            <div className="space-y-4">
              {topPicks.map((m, i) => {
                const catColor = categoryColors[m.category];
                return (
                  <div 
                    key={m.id}
                    className="rounded-xl p-5 cursor-pointer transition-all duration-200"
                    style={{ 
                      backgroundColor: '#014379', 
                      border: '1px solid #0D91FD',
                    }}
                    onClick={() => setSelectedMethodology(m.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#5DB5FE';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#0D91FD';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span 
                            className="text-3xl font-bold"
                            style={{ color: '#0D91FD' }}
                          >
                            #{i + 1}
                          </span>
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>{m.name}</h3>
                            <p className="text-sm" style={{ color: '#5DB5FE' }}>{m.tagline}</p>
                          </div>
                        </div>
                        <p className="text-sm mb-4" style={{ color: '#C2E3FE' }}>{m.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span 
                            className="text-xs px-3 py-1 rounded-full"
                            style={{ backgroundColor: '#021A2E', color: '#C2E3FE' }}
                          >
                            {m.cycleLength}
                          </span>
                          <span 
                            className="text-xs px-3 py-1 rounded-full"
                            style={{ backgroundColor: '#021A2E', color: '#C2E3FE' }}
                          >
                            {m.complexity} Complexity
                          </span>
                          <span 
                            className="text-xs px-3 py-1 rounded-full uppercase font-medium"
                            style={{ backgroundColor: catColor.bg, color: catColor.text }}
                          >
                            {m.category}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6 text-right">
                        <div className="text-4xl font-bold" style={{ color: '#0D91FD' }}>
                          {Math.round(m.score)}
                        </div>
                        <div className="text-xs" style={{ color: '#5DB5FE' }}>match score</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Secondary Recommendations */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5DB5FE' }}></div>
              <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Also Consider</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {secondary.map((m) => (
                <div 
                  key={m.id}
                  className="rounded-lg p-4 cursor-pointer transition-all duration-200"
                  style={{ 
                    backgroundColor: '#014379', 
                    border: '1px solid rgba(13, 145, 253, 0.5)',
                  }}
                  onClick={() => setSelectedMethodology(m.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0D91FD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(13, 145, 253, 0.5)';
                  }}
                >
                  <h3 className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>{m.name}</h3>
                  <p className="text-xs mb-3" style={{ color: '#5DB5FE' }}>{m.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#C2E3FE' }}>{m.cycleLength}</span>
                    <span className="text-lg font-bold" style={{ color: '#0D91FD' }}>{Math.round(m.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pro Tip */}
          <div 
            className="rounded-xl p-5 mb-8"
            style={{ backgroundColor: '#014379', border: '1px solid #5DB5FE' }}
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
              <span style={{ color: '#0D91FD' }}>💡</span> Pro Tip: Combine Methodologies
            </h3>
            <p className="text-sm" style={{ color: '#C2E3FE' }}>
              Most successful teams use one framework for qualification (like MEDDIC) and another for execution 
              (like Challenger or SPIN). Consider pairing your top recommendation with a complementary approach.
            </p>
          </div>
          
          {/* Reset Button */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              style={{ backgroundColor: '#0D91FD', color: '#021A2E' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5DB5FE'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0D91FD'}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question View
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#021A2E' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
            Sales Methodology Advisor
          </h1>
          <p style={{ color: '#5DB5FE' }}>Find the right framework for your sales environment</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between text-sm mb-3">
            <span style={{ color: '#5DB5FE' }}>Question {currentStep + 1} of {questions.length}</span>
            <span style={{ color: '#5DB5FE' }}>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#014379' }}>
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: '#0D91FD' }}
            />
          </div>
        </div>
        
        {/* Question Card */}
        <div 
          className="rounded-xl p-6 md:p-8 mb-6"
          style={{ backgroundColor: '#014379', border: '1px solid #0D91FD' }}
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-8" style={{ color: '#FFFFFF' }}>
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className="w-full text-left p-4 rounded-lg transition-all duration-200"
                  style={{ 
                    backgroundColor: isSelected ? '#0D91FD' : '#021A2E',
                    border: isSelected ? '2px solid #5DB5FE' : '1px solid #014379',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#0D91FD';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#014379';
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ 
                        borderColor: isSelected ? '#FFFFFF' : '#5DB5FE',
                        backgroundColor: isSelected ? '#FFFFFF' : 'transparent'
                      }}
                    >
                      {isSelected && (
                        <div 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: '#0D91FD' }}
                        />
                      )}
                    </div>
                    <div>
                      <span 
                        className="font-medium block mb-1"
                        style={{ color: isSelected ? '#021A2E' : '#FFFFFF' }}
                      >
                        {option.label}
                      </span>
                      <span 
                        className="text-sm"
                        style={{ color: isSelected ? '#014379' : '#5DB5FE' }}
                      >
                        {option.desc}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-5 py-2.5 rounded-lg transition-all duration-200"
            style={{ 
              color: currentStep === 0 ? '#014379' : '#5DB5FE',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (currentStep !== 0) {
                e.target.style.backgroundColor = '#014379';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="px-8 py-2.5 rounded-lg font-semibold transition-all duration-200"
            style={{ 
              backgroundColor: answers[currentQuestion.id] ? '#0D91FD' : '#014379',
              color: answers[currentQuestion.id] ? '#021A2E' : '#5DB5FE',
              cursor: answers[currentQuestion.id] ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (answers[currentQuestion.id]) {
                e.target.style.backgroundColor = '#5DB5FE';
              }
            }}
            onMouseLeave={(e) => {
              if (answers[currentQuestion.id]) {
                e.target.style.backgroundColor = '#0D91FD';
              }
            }}
          >
            {currentStep === questions.length - 1 ? 'See Recommendations' : 'Continue'}
          </button>
        </div>
        
        {/* Browse All Link */}
        <div className="text-center mt-10 pt-6" style={{ borderTop: '1px solid #014379' }}>
          <p className="text-sm mb-2" style={{ color: '#5DB5FE' }}>Want to explore all methodologies?</p>
          <button
            onClick={() => setShowResults(true)}
            className="text-sm underline underline-offset-4 transition-colors duration-200"
            style={{ color: '#0D91FD' }}
            onMouseEnter={(e) => e.target.style.color = '#5DB5FE'}
            onMouseLeave={(e) => e.target.style.color = '#0D91FD'}
          >
            Browse all 12 methodologies →
          </button>
        </div>
      </div>
    </div>
  );
}

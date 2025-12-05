# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sales Methodology Advisor - an interactive React component that recommends enterprise sales frameworks based on user responses to a questionnaire. The tool scores and ranks 12 sales methodologies (MEDDIC, SPIN, Challenger, BANT, etc.) against user inputs about their sales environment.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture

Vite + React + Tailwind CSS project. Main component in `src/App.jsx` containing:
- **Data layer**: `methodologies` array with scoring attributes, `questions` array for the questionnaire
- **State management**: React hooks (`useState`) for step tracking, answers, and view state
- **Scoring algorithm**: `calculateRecommendations()` weights cycle length, complexity, stakeholders, priority focus, and team experience
- **Three views**: Question wizard, Results (top 3 + secondary picks), Methodology detail

## Design System (Tom Panos Brand)

```
Deep Navy (bg):     #021A2E
Navy Blue:          #014379
Bright Blue (CTA):  #0D91FD
Sky Blue:           #5DB5FE
Light Blue:         #C2E3FE
```

## Key Implementation Details

- Methodologies are categorized: `qualification`, `discovery`, `differentiation`, `relationship`, `quick`, `modern`
- Each methodology has a `scores` object with numeric values (1-3) for matching against user inputs
- The scoring formula prioritizes: cycle match (15x), complexity match (15x), stakeholder match (12x), priority match (20x), team experience bonus
- Deployed via Netlify with SPA redirects configured in `netlify.toml`

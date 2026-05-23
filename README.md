# Resume Generator

A robust, enterprise-grade React and TypeScript application designed for constructing, optimizing, and compiling professional, ATS-compatible resumes. The application supports real-time editing, live layout template rendering, dynamic ATS keyword scoring, and high-fidelity client-side PDF generation.

## Key Features

- **Live Interactive Editor**: Seamless, form-based data entry covering all key professional dimensions, including custom contact information, professional summaries, work histories, educational credentials, side projects, categorized skills, and certifications.
- **Applicant Tracking System (ATS) Optimizer**: An algorithmic scoring engine that assesses resume contents in real time. It calculates a completion score and parses pasted job descriptions to identify missing keywords and technical skills.
- **Professional Templates**: Swap resume layouts on the fly with tailored font families, grid systems, and borders. Available templates include:
  - **Classic**: Serif headers, centered alignment, traditional dividers, and elegant structural ratios.
  - **Modern Minimalist**: Sans-serif headings, left-aligned titles, left-bordered accent lines, and a custom vertical accent band.
  - **Executive**: Uppercase sans-serif headers, dynamic tracking, colored title accents, and horizontal separators.
- **Client-Side PDF Compilation**: High-fidelity, client-side PDF rendering using `@react-pdf/renderer` that preserves layout alignments, padding bounds, page constraints, and font configurations exactly.

## Tech Stack

- **Core Framework**: React 19 (TypeScript 5.x)
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **PDF Generation**: `@react-pdf/renderer`
- **Iconography**: Lucide React

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (LTS version recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project root directory.
3. Install the required dependencies:
   ```bash
   npm install
   ```

### Development Server

Launch the local development server with Hot Module Replacement (HMR):
   ```bash
   npm run dev
   ```
The development environment will be accessible at `http://localhost:5173`.

### Production Build

To compile a optimized production-ready bundle, run:
   ```bash
   npm run build
   ```
The output assets will be generated in the `dist` directory. To preview the production bundle locally:
   ```bash
   npm run preview
   ```

## Project Directory Structure

```text
├── src/
│   ├── assets/         # Static assets and fonts
│   ├── components/     # Application components (ResumeBuilder, ResumePDF)
│   ├── types.ts        # TypeScript interface definitions
│   ├── index.css       # Tailwind utility classes and base styles
│   └── main.tsx        # React mounting bootstrap
├── index.html          # HTML entrypoint template
├── vite.config.ts      # Vite configuration schema
├── tailwind.config.js  # Tailwind custom palette configuration
└── tsconfig.json       # TypeScript compiler settings
```

## Linting and Code Quality

This project enforces strict code style guidelines using ESLint. To execute static analysis:
   ```bash
   npm run lint
   ```

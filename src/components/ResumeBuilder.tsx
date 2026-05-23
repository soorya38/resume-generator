import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, FolderGit2, Sparkles, Check, 
  Trash2, Plus, ArrowUp, ArrowDown, Copy, Download, Info, CheckCircle2, 
  XCircle, ChevronDown, ChevronUp, CopyCheck, RefreshCw, FileText, SlidersHorizontal
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF';
import type { ResumeState, WorkExperience, Education, Skill, Certification, Project, ResumeTemplate, AccentColorPreset, SkillGroup } from '../types';

// Action verbs list for ATS scoring
const ACTION_VERBS = new Set([
  'led', 'managed', 'developed', 'designed', 'created', 'built', 'implemented', 'analyzed',
  'coordinated', 'initiated', 'executed', 'formulated', 'improved', 'increased', 'optimized',
  'streamlined', 'spearheaded', 'wrote', 'authored', 'cultivated', 'directed', 'established',
  'formed', 'overhauled', 'pioneered', 'reduced', 'resolved', 'restructured', 'supervised',
  'maintained', 'tested', 'programmed', 'automated', 'architected', 'engineered', 'drafted',
  'conducted', 'delivered', 'facilitated', 'negotiated', 'transformed', 'accelerated', 'amplified',
  'boosted', 'championed', 'deployed', 'expanded', 'generated', 'launched', 'maximized',
  'modernized', 'orchestrated', 'produced', 'strengthened', 'updated', 'validated'
]);

// Color theme presets mapping
const COLOR_THEMES = {
  slate: {
    hex: '#475569',
    bg: 'bg-slate-600',
    border: 'border-slate-500',
    text: 'text-slate-600',
    bgLight: 'bg-slate-500/10',
    borderLight: 'border-slate-500/30'
  },
  navy: {
    hex: '#1d4ed8',
    bg: 'bg-blue-600',
    border: 'border-blue-500',
    text: 'text-blue-600',
    bgLight: 'bg-blue-500/10',
    borderLight: 'border-blue-500/30'
  },
  forest: {
    hex: '#047857',
    bg: 'bg-emerald-600',
    border: 'border-emerald-500',
    text: 'text-emerald-600',
    bgLight: 'bg-emerald-500/10',
    borderLight: 'border-emerald-500/30'
  },
  burgundy: {
    hex: '#be123c',
    bg: 'bg-rose-600',
    border: 'border-rose-500',
    text: 'text-rose-600',
    bgLight: 'bg-rose-500/10',
    borderLight: 'border-rose-500/30'
  },
  charcoal: {
    hex: '#374151',
    bg: 'bg-gray-700',
    border: 'border-gray-600',
    text: 'text-gray-700',
    bgLight: 'bg-gray-500/10',
    borderLight: 'border-gray-500/30'
  }
};

// Initial state and sample data for the preview
const SAMPLE_DATA: ResumeState = {
  meta: {
    template: 'modern',
    accentColor: '#1d4ed8',
    accentName: 'navy',
    targetJobTitle: 'Senior Software Engineer'
  },
  header: {
    name: 'Alex Mercer',
    title: 'Senior Software Engineer',
    email: 'alex.mercer@email.com',
    phone: '(555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alex-mercer',
    portfolio: 'https://github.com/alex-mercer'
  },
  summary: 'Led the architecture and implementation of scalable SaaS products for over 6 years. Optimized application response times by 35% using React, Node.js, and TypeScript. Spearheaded a team of 5 engineers to deliver high-quality cloud deployments on AWS. Cultivated strong agile practices and mentored junior staff to build reusable component libraries.',
  experience: [
    {
      id: 'exp-1',
      company: 'InnovateTech Systems',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      start: '2023-03',
      end: 'Present',
      current: true,
      bullets: [
        'Spearheaded the migration of a legacy system to a modern microservices architecture, reducing latency by 45%.',
        'Optimized data syncing logic, saving 20+ hours of compute cost weekly and boosting throughput by 30%.',
        'Led team sprints and coordinated with product owners to deliver 5 high-impact features on schedule.'
      ]
    },
    {
      id: 'exp-2',
      company: 'WebFlow Solutions',
      title: 'Software Engineer',
      location: 'Austin, TX',
      start: '2020-08',
      end: '2023-02',
      current: false,
      bullets: [
        'Developed full-stack features using React and Express, improving user retention rates by 12%.',
        'Built automated Jest test suites, increasing overall code coverage from 60% to 88% and cutting bug count.',
        'Streamlined asset loading protocols, which reduced initial load time by 1.2 seconds.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Davis',
      degree: 'B.S.',
      field: 'Computer Science & Engineering',
      year: '2020',
      gpa: '3.7'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'React', group: 'technical' },
    { id: 'sk-2', name: 'TypeScript', group: 'technical' },
    { id: 'sk-3', name: 'Node.js', group: 'technical' },
    { id: 'sk-4', name: 'System Design', group: 'technical' },
    { id: 'sk-5', name: 'AWS Cloud', group: 'tools' },
    { id: 'sk-6', name: 'Docker', group: 'tools' },
    { id: 'sk-7', name: 'Git & CI/CD', group: 'tools' },
    { id: 'sk-8', name: 'Team Mentorship', group: 'soft' },
    { id: 'sk-9', name: 'Agile/Scrum', group: 'soft' }
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Certified Solutions Architect', org: 'Amazon Web Services', year: '2024' }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Dynamic Resume Analyzer',
      description: 'Built a React and TypeScript-based web application parsing candidate profiles to provide real-time ATS optimization scoring.',
      tech: 'React, Tailwind CSS, TypeScript',
      url: 'https://github.com/alex-mercer/resume-analyzer'
    }
  ],
  jobDescription: ''
};

const BLANK_STATE: ResumeState = {
  meta: {
    template: 'classic',
    accentColor: '#475569',
    accentName: 'slate',
    targetJobTitle: ''
  },
  header: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  jobDescription: ''
};

type RepeatableSection = 'experience' | 'education' | 'projects' | 'certifications';

const createId = () => crypto.randomUUID().slice(0, 8);

const duplicateListItem = <T extends { id: string }>(list: T[], id: string): T[] => {
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return list;

  const newItem = {
    ...list[index],
    id: createId()
  };

  return [
    ...list.slice(0, index + 1),
    newItem,
    ...list.slice(index + 1)
  ];
};

export const ResumeBuilder: React.FC = () => {
  const [state, setState] = useState<ResumeState>(SAMPLE_DATA);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');
  const [copiedTextStatus, setCopiedTextStatus] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState<string>('');
  const [skillGroupInput, setSkillGroupInput] = useState<SkillGroup>('technical');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Accordion open/close states
  const [sectionsOpen, setSectionsOpen] = useState({
    theme: true,
    header: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    jobDesc: true
  });

  // Auto-save visual cue (cosmetic in-memory auto-saver)
  const saveTimeoutRef = useRef<number | null>(null);

  const updateResumeState = (updater: React.SetStateAction<ResumeState>) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      setSaveStatus('saved');
    }, 600);

    setState(updater);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Section toggle open/close helper
  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // State modification shortcuts
  const updateMeta = <K extends keyof ResumeState['meta']>(key: K, value: ResumeState['meta'][K]) => {
    updateResumeState(prev => ({
      ...prev,
      meta: { ...prev.meta, [key]: value }
    }));
  };

  const updateHeader = (key: keyof ResumeState['header'], value: string) => {
    updateResumeState(prev => ({
      ...prev,
      header: { ...prev.header, [key]: value }
    }));
  };

  // Repeatable sections CRUD functions
  const addExperience = () => {
    const newItem: WorkExperience = {
      id: createId(),
      company: '',
      title: '',
      location: '',
      start: '',
      end: '',
      current: false,
      bullets: ['']
    };
    updateResumeState(prev => ({
      ...prev,
      experience: [...prev.experience, newItem]
    }));
  };

  const updateExperience = <K extends keyof WorkExperience>(id: string, key: K, value: WorkExperience[K]) => {
    updateResumeState(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [key]: value } : exp)
    }));
  };

  const deleteExperience = (id: string) => {
    updateResumeState(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Experience bullets crud
  const addBullet = (expId: string) => {
    updateResumeState(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      )
    }));
  };

  const updateBullet = (expId: string, bulletIdx: number, value: string) => {
    updateResumeState(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId ? { 
          ...exp, 
          bullets: exp.bullets.map((b, idx) => idx === bulletIdx ? value : b) 
        } : exp
      )
    }));
  };

  const deleteBullet = (expId: string, bulletIdx: number) => {
    updateResumeState(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId ? { 
          ...exp, 
          bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx) 
        } : exp
      )
    }));
  };

  // Education CRM
  const addEducation = () => {
    const newItem: Education = {
      id: createId(),
      institution: '',
      degree: '',
      field: '',
      year: '',
      gpa: ''
    };
    updateResumeState(prev => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const updateEducation = <K extends keyof Education>(id: string, key: K, value: Education[K]) => {
    updateResumeState(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [key]: value } : edu)
    }));
  };

  const deleteEducation = (id: string) => {
    updateResumeState(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Project CRD
  const addProject = () => {
    const newItem: Project = {
      id: createId(),
      name: '',
      description: '',
      tech: '',
      url: ''
    };
    updateResumeState(prev => ({ ...prev, projects: [...prev.projects, newItem] }));
  };

  const updateProject = (id: string, key: keyof Project, value: string) => {
    updateResumeState(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? { ...proj, [key]: value } : proj)
    }));
  };

  const deleteProject = (id: string) => {
    updateResumeState(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  // Certifications CRUD
  const addCertification = () => {
    const newItem: Certification = {
      id: createId(),
      name: '',
      org: '',
      year: ''
    };
    updateResumeState(prev => ({ ...prev, certifications: [...prev.certifications, newItem] }));
  };

  const updateCertification = (id: string, key: keyof Certification, value: string) => {
    updateResumeState(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [key]: value } : c)
    }));
  };

  const deleteCertification = (id: string) => {
    updateResumeState(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  // Move items (up/down reorder)
  const moveItem = (section: RepeatableSection, index: number, direction: 'up' | 'down') => {
    const list = [...state[section]];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    // Swap
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    updateResumeState(prev => ({
      ...prev,
      [section]: list
    }));
  };

  // Duplicate items
  const duplicateItem = (section: RepeatableSection, id: string) => {
    updateResumeState(prev => ({
      ...prev,
      experience: section === 'experience' ? duplicateListItem(prev.experience, id) : prev.experience,
      education: section === 'education' ? duplicateListItem(prev.education, id) : prev.education,
      projects: section === 'projects' ? duplicateListItem(prev.projects, id) : prev.projects,
      certifications: section === 'certifications' ? duplicateListItem(prev.certifications, id) : prev.certifications
    }));
  };

  // Skills chips add / remove
  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const newSkill: Skill = {
        id: createId(),
        name: skillInput.trim(),
        group: skillGroupInput
      };
      updateResumeState(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (id: string) => {
    updateResumeState(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  // Action verb starts check
  const startsWithActionVerb = (bullet: string): boolean => {
    if (!bullet || bullet.trim() === '') return false;
    const firstWord = bullet.trim().split(/\s+/)[0].replace(/[.,/#!$%^&*;:{}=_`~()-]/g, "").toLowerCase();
    return ACTION_VERBS.has(firstWord);
  };

  // Real-time ATS Scorer logic
  const calculateATSChecklist = () => {
    const checklist = [
      {
        id: 'summary-title',
        label: 'Summary contains target job title',
        points: 10,
        passed: state.summary.toLowerCase().includes((state.meta.targetJobTitle || '___nonexistent___').toLowerCase().trim()) && !!state.meta.targetJobTitle
      },
      {
        id: 'skills-count',
        label: 'At least 5 skills listed',
        points: 10,
        passed: state.skills.length >= 5
      },
      {
        id: 'skills-keywords',
        label: 'Skills match job title keywords',
        points: 10,
        passed: (() => {
          if (!state.meta.targetJobTitle || state.skills.length === 0) return false;
          const ignore = new Set([
            'senior', 'junior', 'lead', 'staff', 'principal', 'developer', 'engineer', 'architect',
            'manager', 'specialist', 'analyst', 'associate', 'intern', 'director', 'vice', 'president',
            'and', 'or', 'of', 'in', 'the', 'a', 'to', 'for', 'with', 'at', 'by', 'an'
          ]);
          const titleWords = state.meta.targetJobTitle
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2 && !ignore.has(w));
          
          if (titleWords.length === 0) return false;
          const skillNamesLower = state.skills.map(s => s.name.toLowerCase());
          return titleWords.some(word => 
            skillNamesLower.some(skill => skill.includes(word) || word.includes(skill))
          );
        })()
      },
      {
        id: 'action-verbs',
        label: 'Experience bullets start with action verbs',
        points: 20,
        passed: (() => {
          if (state.experience.length === 0) return false;
          let hasBullets = false;
          for (const exp of state.experience) {
            const valid = exp.bullets.filter(b => b.trim() !== '');
            if (valid.length > 0) {
              hasBullets = true;
              for (const bullet of valid) {
                if (!startsWithActionVerb(bullet)) return false;
              }
            }
          }
          return hasBullets;
        })()
      },
      {
        id: 'quantified',
        label: 'Quantified achievements present (numbers/%)',
        points: 15,
        passed: (() => {
          if (state.experience.length === 0) return false;
          for (const exp of state.experience) {
            for (const bullet of exp.bullets) {
              if (/[0-9]+|%/.test(bullet)) return true;
            }
          }
          return false;
        })()
      },
      {
        id: 'contact-complete',
        label: 'Contact info complete (email, phone, location)',
        points: 10,
        passed: !!(state.header.email?.trim() && state.header.phone?.trim() && state.header.location?.trim())
      },
      {
        id: 'no-graphics',
        label: 'No photos, tables, or complex shapes',
        points: 5,
        passed: true // Static rule matching template constraints
      },
      {
        id: 'standard-headings',
        label: 'Standardized layout headings',
        points: 10,
        passed: true // Locked layout compliance
      },
      {
        id: 'appropriate-length',
        label: 'Resume fits within standard length (<2 pages)',
        points: 10,
        passed: (() => {
          let lines = 5;
          lines += Math.ceil(state.summary.length / 80);
          state.experience.forEach(exp => {
            lines += 2;
            lines += exp.bullets.length;
          });
          state.education.forEach(() => {
            lines += 2;
          });
          state.projects.forEach(proj => {
            lines += 2;
            if (proj.description) lines += Math.ceil(proj.description.length / 80);
          });
          lines += Math.ceil(state.skills.length / 4);
          lines += state.certifications.length;
          return lines <= 110;
        })()
      }
    ];

    const score = checklist.reduce((acc, curr) => curr.passed ? acc + curr.points : acc, 0);

    return { checklist, score };
  };

  const { checklist, score } = calculateATSChecklist();

  // Keyword Matching Logic (Job Description compared to Resume)
  const getMissingKeywords = () => {
    if (!state.jobDescription || state.jobDescription.trim() === '') return [];

    const stopWords = new Set([
      'and', 'the', 'a', 'to', 'of', 'for', 'in', 'on', 'with', 'at', 'by', 'an', 'is', 'are', 'was', 'were',
      'that', 'this', 'from', 'as', 'but', 'not', 'or', 'if', 'you', 'your', 'we', 'our', 'us', 'i', 'my', 'me',
      'it', 'its', 'they', 'them', 'their', 'he', 'him', 'his', 'she', 'her', 'has', 'have', 'had', 'do', 'does',
      'did', 'been', 'being', 'be', 'will', 'would', 'should', 'can', 'could', 'may', 'might', 'must', 'about',
      'all', 'also', 'any', 'co', 'etc', 'has', 'inc', 'into', 'its', 'like', 'more', 'most', 'new', 'no', 'of',
      'off', 'out', 'over', 're', 'so', 'some', 'such', 'than', 'then', 'up', 'very', 'who', 'how', 'what', 'why'
    ]);

    const extractWords = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .split(/[\s]+/)
        .map(w => w.trim())
        .filter(w => w.length > 2 && !stopWords.has(w));
    };

    const jdWords = extractWords(state.jobDescription);
    const wordFreq: { [key: string]: number } = {};
    jdWords.forEach(w => {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    });

    const sortedKeywords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);
    const topJDKeywords = sortedKeywords.slice(0, 15);

    // Compile entire resume text
    let resumeText = `${state.header.name} ${state.header.title} ${state.meta.targetJobTitle} ${state.summary}`;
    state.experience.forEach(exp => {
      resumeText += ` ${exp.title} ${exp.company} ${exp.location} ${exp.bullets.join(' ')}`;
    });
    state.education.forEach(edu => {
      resumeText += ` ${edu.degree} ${edu.field} ${edu.institution}`;
    });
    state.projects.forEach(proj => {
      resumeText += ` ${proj.name} ${proj.description} ${proj.tech}`;
    });
    state.skills.forEach(skill => {
      resumeText += ` ${skill.name}`;
    });
    state.certifications.forEach(cert => {
      resumeText += ` ${cert.name} ${cert.org}`;
    });

    const resumeWords = new Set(extractWords(resumeText));
    return topJDKeywords.filter(keyword => !resumeWords.has(keyword));
  };

  const missingKeywords = getMissingKeywords();

  // Color preset mapping selections
  const currentAccent = COLOR_THEMES[state.meta.accentName];

  // Template switching triggers
  const handleTemplateSelect = (template: ResumeTemplate) => {
    updateMeta('template', template);
  };

  const handleAccentChange = (name: AccentColorPreset) => {
    updateMeta('accentName', name);
    updateMeta('accentColor', COLOR_THEMES[name].hex);
  };

  // Asynchronous browser-based PDF rendering & trigger download
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const doc = <ResumePDF data={state} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const applicantName = state.header.name.trim().replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '') || 'Applicant';
      const fileName = `${applicantName}_Resume.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('PDF compiling error: ', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Formulate copy plain text output
  const generatePlainText = () => {
    const { header, summary, experience, education, skills, certifications, projects } = state;
    
    let text = '';
    text += `${(header.name || 'Jane Doe').toUpperCase()}\n`;
    text += `${header.title || 'Senior Software Engineer'}\n`;
    text += `${header.email || 'jane@example.com'} | ${header.phone || '(555) 555-5555'} | ${header.location || 'City, State'}\n`;
    
    if (header.linkedin || header.portfolio) {
      const links = [];
      if (header.linkedin) links.push(`LinkedIn: ${header.linkedin}`);
      if (header.portfolio) links.push(`Portfolio/GitHub: ${header.portfolio}`);
      text += `${links.join(' | ')}\n`;
    }
    
    text += `\n========================================\n`;
    text += `PROFESSIONAL SUMMARY\n`;
    text += `========================================\n`;
    text += `${summary || 'Summary goes here.'}\n\n`;

    if (experience.length > 0) {
      text += `========================================\n`;
      text += `EXPERIENCE\n`;
      text += `========================================\n`;
      experience.forEach(exp => {
        text += `${exp.title || 'Role'} at ${exp.company || 'Company'} (${exp.location || 'Location'})\n`;
        text += `${exp.start || 'Start'} – ${exp.current ? 'Present' : (exp.end || 'End')}\n`;
        exp.bullets.forEach(bullet => {
          if (bullet.trim()) text += `- ${bullet}\n`;
        });
        text += `\n`;
      });
    }

    if (projects.length > 0) {
      text += `========================================\n`;
      text += `PROJECTS\n`;
      text += `========================================\n`;
      projects.forEach(proj => {
        text += `${proj.name || 'Project Name'}${proj.tech ? ` (${proj.tech})` : ''}\n`;
        if (proj.url) text += `Link: ${proj.url}\n`;
        if (proj.description) text += `${proj.description}\n`;
        text += `\n`;
      });
    }

    if (skills.length > 0) {
      text += `========================================\n`;
      text += `SKILLS\n`;
      text += `========================================\n`;
      const tech = skills.filter(s => s.group === 'technical').map(s => s.name).join(', ');
      const tools = skills.filter(s => s.group === 'tools').map(s => s.name).join(', ');
      const soft = skills.filter(s => s.group === 'soft').map(s => s.name).join(', ');
      if (tech) text += `Technical: ${tech}\n`;
      if (tools) text += `Tools & Platforms: ${tools}\n`;
      if (soft) text += `Soft Skills: ${soft}\n`;
      text += `\n`;
    }

    if (certifications.length > 0) {
      text += `========================================\n`;
      text += `CERTIFICATIONS\n`;
      text += `========================================\n`;
      certifications.forEach(cert => {
        text += `${cert.name || 'Cert'} – ${cert.org || 'Issuer'} (${cert.year || 'Year'})\n`;
      });
      text += `\n`;
    }

    if (education.length > 0) {
      text += `========================================\n`;
      text += `EDUCATION\n`;
      text += `========================================\n`;
      education.forEach(edu => {
        text += `${edu.degree || 'Degree'} in ${edu.field || 'Field'}\n`;
        text += `${edu.institution || 'School'} | Class of ${edu.year || 'Year'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}\n\n`;
      });
    }

    return text;
  };

  const handleCopyPlainText = () => {
    const rawText = generatePlainText();
    navigator.clipboard.writeText(rawText).then(() => {
      setCopiedTextStatus(true);
      setTimeout(() => setCopiedTextStatus(false), 2000);
    });
  };

  // Pre-load dummy data or wipe out
  const loadSample = () => updateResumeState(SAMPLE_DATA);
  const clearForm = () => updateResumeState(BLANK_STATE);

  // Score visual styling class
  const getScoreColorClass = (val: number) => {
    if (val < 50) return 'bg-red-500';
    if (val < 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getScoreTextClass = (val: number) => {
    if (val < 50) return 'text-red-600';
    if (val < 80) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* HEADER ACTIONS */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-indigo-700 to-blue-600">
              Resume Generator
            </h1>
            <p className="text-xs text-slate-600">Production-grade ATS optimizer resume builder</p>
          </div>
        </div>

        {/* Action Controls & Auto-saver visual */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white/80 border border-slate-200 py-1.5 px-3 rounded-full">
            <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-blue-400 animate-pulse'}`}></span>
            <span className="text-xs text-slate-600 font-medium">
              {saveStatus === 'saved' ? 'All changes saved' : 'Saving...'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSample}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-lg font-medium border border-slate-300 transition-all"
            >
              Load Sample
            </button>
            <button
              onClick={clearForm}
              className="text-xs bg-white hover:bg-slate-100 hover:text-red-600 text-slate-600 px-3.5 py-2 rounded-lg font-medium border border-slate-200 transition-all"
            >
              Clear Form
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TAB CONTROLS */}
      <div className="md:hidden flex bg-white border-b border-slate-200">
        <button
          onClick={() => setActiveMobileTab('edit')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${activeMobileTab === 'edit' ? 'border-indigo-500 text-indigo-600 bg-indigo-500/5' : 'border-transparent text-slate-600'}`}
        >
          1. Edit Resume
        </button>
        <button
          onClick={() => setActiveMobileTab('preview')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${activeMobileTab === 'preview' ? 'border-indigo-500 text-indigo-600 bg-indigo-500/5' : 'border-transparent text-slate-600'}`}
        >
          2. View Preview ({score} pts)
        </button>
      </div>

      {/* CORE WORKSPACE PANELS */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANEL: RESUME FORM EDITOR */}
        <section 
          className={`flex-1 md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-slate-200 space-y-6 ${activeMobileTab === 'edit' ? 'block' : 'hidden md:block'}`}
        >
          {/* ACCENT AND TEMPLATE SELECTIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800">Global Styling Presets</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Theme presets */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Accent Color Theme</label>
                <div className="flex gap-2.5">
                  {(Object.keys(COLOR_THEMES) as AccentColorPreset[]).map(key => (
                    <button
                      key={key}
                      onClick={() => handleAccentChange(key)}
                      title={key.toUpperCase()}
                      className={`w-7 h-7 rounded-full transition-all flex items-center justify-center border-2 ${state.meta.accentName === key ? 'border-slate-900 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: COLOR_THEMES[key].hex }}
                    >
                      {state.meta.accentName === key && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Job Title (ATS scorer target) */}
              <div>
                <label htmlFor="target-job-title" className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Target Job Title</label>
                <input
                  id="target-job-title"
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={state.meta.targetJobTitle}
                  onChange={(e) => updateMeta('targetJobTitle', e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* FORM SECTIONS */}
          <div className="space-y-4">
            
            {/* HEADER ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('header')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Contact Details</h4>
                    <p className="text-xs text-slate-600">Your professional header details</p>
                  </div>
                </div>
                {sectionsOpen.header ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.header && (
                <div className="px-5 pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200">
                  <div>
                    <label htmlFor="full-name" className="text-xs font-medium text-slate-600 mb-1.5 block">Full Name</label>
                    <input
                      id="full-name"
                      type="text"
                      placeholder="Jane Doe"
                      value={state.header.name}
                      onChange={(e) => updateHeader('name', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="job-title" className="text-xs font-medium text-slate-600 mb-1.5 block">Job Title / Target Role</label>
                    <input
                      id="job-title"
                      type="text"
                      placeholder="Senior Software Engineer"
                      value={state.header.title}
                      onChange={(e) => updateHeader('title', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-xs font-medium text-slate-600 mb-1.5 block">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={state.header.email}
                      onChange={(e) => updateHeader('email', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs font-medium text-slate-600 mb-1.5 block">Phone Number</label>
                    <input
                      id="phone"
                      type="text"
                      placeholder="(555) 555-5555"
                      value={state.header.phone}
                      onChange={(e) => updateHeader('phone', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="text-xs font-medium text-slate-600 mb-1.5 block">Location</label>
                    <input
                      id="location"
                      type="text"
                      placeholder="San Francisco, CA"
                      value={state.header.location}
                      onChange={(e) => updateHeader('location', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin-url" className="text-xs font-medium text-slate-600 mb-1.5 block">LinkedIn URL</label>
                    <input
                      id="linkedin-url"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={state.header.linkedin}
                      onChange={(e) => updateHeader('linkedin', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="portfolio-url" className="text-xs font-medium text-slate-600 mb-1.5 block">Portfolio / GitHub URL</label>
                    <input
                      id="portfolio-url"
                      type="url"
                      placeholder="https://github.com/username"
                      value={state.header.portfolio}
                      onChange={(e) => updateHeader('portfolio', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition-all outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SUMMARY ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('summary')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Professional Summary</h4>
                    <p className="text-xs text-slate-600">3–5 sentences highlighting skills and roles</p>
                  </div>
                </div>
                {sectionsOpen.summary ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.summary && (
                <div className="px-5 pb-5 pt-1 space-y-3.5 border-t border-slate-200">
                  <div className="bg-blue-500/5 border border-blue-500/25 rounded-xl p-3.5 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wide">ATS TIP</h5>
                      <p className="text-xs text-slate-700 leading-normal">
                        Include your target job title and 2–3 core skills in the summary.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="summary-textarea" className="text-xs font-medium text-slate-600">Summary Text</label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {state.summary.length} characters
                      </span>
                    </div>
                    <textarea
                      id="summary-textarea"
                      rows={4}
                      placeholder="Highly accomplished Senior Software Engineer with..."
                      value={state.summary}
                      onChange={(e) => updateResumeState(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2.5 rounded-lg text-sm transition-all outline-none resize-y"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* WORK EXPERIENCE ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('experience')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Work Experience</h4>
                    <p className="text-xs text-slate-600">Add, duplicate, and order your work history</p>
                  </div>
                </div>
                {sectionsOpen.experience ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.experience && (
                <div className="px-5 pb-5 pt-1 space-y-6 border-t border-slate-200">
                  {state.experience.map((exp, index) => (
                    <div key={exp.id} className="relative bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
                      
                      {/* Drag / Action controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => moveItem('experience', index, 'up')}
                            disabled={index === 0}
                            title="Move Up"
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('experience', index, 'down')}
                            disabled={index === state.experience.length - 1}
                            title="Move Down"
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-slate-600 font-semibold ml-1">
                            Entry #{index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateItem('experience', exp.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteExperience(exp.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 px-2.5 py-1 rounded border border-slate-200 hover:border-red-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Main fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`company-${exp.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Company</label>
                          <input
                            id={`company-${exp.id}`}
                            type="text"
                            placeholder="InnovateTech Systems"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`job-title-${exp.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Job Title</label>
                          <input
                            id={`job-title-${exp.id}`}
                            type="text"
                            placeholder="Senior Software Engineer"
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`exp-location-${exp.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Location</label>
                          <input
                            id={`exp-location-${exp.id}`}
                            type="text"
                            placeholder="San Francisco, CA"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>

                        {/* Dates grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label htmlFor={`start-date-${exp.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Start Date</label>
                            <input
                              id={`start-date-${exp.id}`}
                              type="month"
                              value={exp.start}
                              onChange={(e) => updateExperience(exp.id, 'start', e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-2 py-1.5 rounded-lg text-sm transition outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor={`end-date-${exp.id}`} className="text-xs font-medium text-slate-600 mb-1 block">End Date</label>
                            <input
                              id={`end-date-${exp.id}`}
                              type="month"
                              value={exp.end}
                              disabled={exp.current}
                              onChange={(e) => updateExperience(exp.id, 'end', e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-2 py-1.5 rounded-lg text-sm transition outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Present checkbox */}
                        <div className="sm:col-span-2 flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="rounded bg-slate-50 border-slate-200 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-700 font-medium cursor-pointer">
                            I currently work here
                          </label>
                        </div>
                      </div>

                      {/* Bullets lists */}
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Responsibilities Bullets</span>
                          <button
                            type="button"
                            onClick={() => addBullet(exp.id)}
                            className="text-[11px] flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Bullet
                          </button>
                        </div>

                        {/* ATS Hint inside experience */}
                        <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 leading-relaxed">
                          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>ATS Hint:</strong> Start with a strong action verb (e.g. <em>Led, Optimized, Streamlined</em>) and include metrics where possible.
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {exp.bullets.map((bullet, bulletIdx) => {
                            const isActionVerb = startsWithActionVerb(bullet);
                            const hasQuantified = /[0-9]+|%/.test(bullet);

                            return (
                              <div key={bulletIdx} className="flex gap-2 items-start">
                                <div className="flex-1 space-y-1">
                                  <textarea
                                    rows={2}
                                    placeholder="Spearheaded React app conversion, accelerating load times by 40%..."
                                    value={bullet}
                                    onChange={(e) => updateBullet(exp.id, bulletIdx, e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3 py-1.5 rounded-lg text-sm transition outline-none resize-none"
                                  />
                                  {bullet.trim() !== '' && (
                                    <div className="flex gap-3 px-1 text-[10px]">
                                      <span className={isActionVerb ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                                        {isActionVerb ? '✓ Action Verb' : '✗ Start with Action Verb'}
                                      </span>
                                      <span className={hasQuantified ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                                        {hasQuantified ? '✓ Quantified metric' : '✗ Include metric (numbers/%)'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => deleteBullet(exp.id, bulletIdx)}
                                  title="Remove Bullet"
                                  className="mt-2.5 p-1 text-slate-500 hover:text-red-600 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addExperience}
                    className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Work Experience
                  </button>
                </div>
              )}
            </div>

            {/* EDUCATION ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('education')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Education</h4>
                    <p className="text-xs text-slate-600">List degrees, GPA, and universities</p>
                  </div>
                </div>
                {sectionsOpen.education ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.education && (
                <div className="px-5 pb-5 pt-1 space-y-5 border-t border-slate-200">
                  {state.education.map((edu, index) => (
                    <div key={edu.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
                      
                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveItem('education', index, 'up')}
                            disabled={index === 0}
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('education', index, 'down')}
                            disabled={index === state.education.length - 1}
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-slate-600 font-semibold ml-1">
                            Entry #{index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateItem('education', edu.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEducation(edu.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 px-2.5 py-1 rounded border border-slate-200 hover:border-red-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Input grids */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label htmlFor={`institution-${edu.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Institution / University</label>
                          <input
                            id={`institution-${edu.id}`}
                            type="text"
                            placeholder="University of California, Davis"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`degree-${edu.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Degree</label>
                          <input
                            id={`degree-${edu.id}`}
                            type="text"
                            placeholder="B.S. or M.S."
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`field-${edu.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Field of Study</label>
                          <input
                            id={`field-${edu.id}`}
                            type="text"
                            placeholder="Computer Science & Engineering"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`grad-year-${edu.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Graduation Year</label>
                          <input
                            id={`grad-year-${edu.id}`}
                            type="text"
                            placeholder="2020"
                            value={edu.year}
                            onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`gpa-${edu.id}`} className="text-xs font-medium text-slate-600 mb-1 block">GPA (Optional)</label>
                          <input
                            id={`gpa-${edu.id}`}
                            type="text"
                            placeholder="3.8 / 4.0"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addEducation}
                    className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>
              )}
            </div>

            {/* PROJECTS ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('projects')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <FolderGit2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Projects</h4>
                    <p className="text-xs text-slate-600">Side projects and code repositories (Optional)</p>
                  </div>
                </div>
                {sectionsOpen.projects ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.projects && (
                <div className="px-5 pb-5 pt-1 space-y-5 border-t border-slate-200">
                  {state.projects.map((proj, index) => (
                    <div key={proj.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
                      
                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveItem('projects', index, 'up')}
                            disabled={index === 0}
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('projects', index, 'down')}
                            disabled={index === state.projects.length - 1}
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-slate-600 font-semibold ml-1">
                            Entry #{index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateItem('projects', proj.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProject(proj.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 px-2.5 py-1 rounded border border-slate-200 hover:border-red-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`proj-name-${proj.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Project Name</label>
                          <input
                            id={`proj-name-${proj.id}`}
                            type="text"
                            placeholder="Dynamic Resume Analyzer"
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor={`proj-tech-${proj.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Technologies Used</label>
                          <input
                            id={`proj-tech-${proj.id}`}
                            type="text"
                            placeholder="React, TypeScript, AWS"
                            value={proj.tech}
                            onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor={`proj-url-${proj.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Project URL (Optional)</label>
                          <input
                            id={`proj-url-${proj.id}`}
                            type="url"
                            placeholder="https://github.com/alex-mercer/resume-analyzer"
                            value={proj.url}
                            onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor={`proj-desc-${proj.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                          <textarea
                            id={`proj-desc-${proj.id}`}
                            rows={3}
                            placeholder="Designed and developed an automated client-side parsing app..."
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addProject}
                    className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
              )}
            </div>

            {/* SKILLS ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('skills')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Skills Tags</h4>
                    <p className="text-xs text-slate-600">Type skills and hit Enter to group chips</p>
                  </div>
                </div>
                {sectionsOpen.skills ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.skills && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category Group Selector */}
                    <div>
                      <label htmlFor="skill-category" className="text-xs font-medium text-slate-600 mb-1.5 block">Target Skill Group</label>
                      <select
                        id="skill-category"
                        value={skillGroupInput}
                        onChange={(e) => setSkillGroupInput(e.target.value as SkillGroup)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 text-slate-700 px-3.5 py-2.5 rounded-lg text-sm transition outline-none"
                      >
                        <option value="technical">Technical Skills</option>
                        <option value="soft">Soft Skills</option>
                        <option value="tools">Tools & Platforms</option>
                      </select>
                    </div>

                    {/* Skill inputs */}
                    <div>
                      <label htmlFor="skill-name" className="text-xs font-medium text-slate-600 mb-1.5 block">Add Skill (Press Enter)</label>
                      <input
                        id="skill-name"
                        type="text"
                        placeholder="React, TypeScript, etc."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2 rounded-lg text-sm transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Skills lists by categories */}
                  <div className="space-y-4.5 pt-3">
                    {(['technical', 'tools', 'soft'] as const).map(group => {
                      const list = state.skills.filter(s => s.group === group);
                      const displayTitle = group === 'technical' ? 'Technical Skills' : group === 'tools' ? 'Tools & Platforms' : 'Soft Skills';
                      const badgeClass = group === 'technical' ? 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20' : group === 'tools' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-purple-500/10 text-purple-700 border-purple-500/20';

                      return (
                        <div key={group} className="space-y-2">
                          <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            {displayTitle} ({list.length})
                          </h5>
                          {list.length === 0 ? (
                            <p className="text-[11px] text-slate-600 italic">No skills added in this category.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {list.map(skill => (
                                <div
                                  key={skill.id}
                                  className={`flex items-center gap-1.5 border text-xs px-2.5 py-1.5 rounded-full font-medium ${badgeClass}`}
                                >
                                  <span>{skill.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeSkill(skill.id)}
                                    className="hover:text-red-600 font-bold ml-0.5 outline-none"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CERTIFICATIONS ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('certifications')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Certifications</h4>
                    <p className="text-xs text-slate-600">Add credentials, organizations, and years</p>
                  </div>
                </div>
                {sectionsOpen.certifications ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.certifications && (
                <div className="px-5 pb-5 pt-1 space-y-5 border-t border-slate-200">
                  {state.certifications.map((cert, index) => (
                    <div key={cert.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
                      
                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveItem('certifications', index, 'up')}
                            disabled={index === 0}
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('certifications', index, 'down')}
                            disabled={index === state.certifications.length - 1}
                            className="p-1 bg-white hover:bg-slate-100 text-slate-600 disabled:text-slate-400 disabled:opacity-40 rounded border border-slate-200 transition"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-slate-600 font-semibold ml-1">
                            Entry #{index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateItem('certifications', cert.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCertification(cert.id)}
                            className="text-xs flex items-center gap-1.5 bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 px-2.5 py-1 rounded border border-slate-200 hover:border-red-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label htmlFor={`cert-name-${cert.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Certification Name</label>
                          <input
                            id={`cert-name-${cert.id}`}
                            type="text"
                            placeholder="AWS Solutions Architect"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label htmlFor={`cert-org-${cert.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Issuing Organization</label>
                          <input
                            id={`cert-org-${cert.id}`}
                            type="text"
                            placeholder="Amazon Web Services"
                            value={cert.org}
                            onChange={(e) => updateCertification(cert.id, 'org', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label htmlFor={`cert-year-${cert.id}`} className="text-xs font-medium text-slate-600 mb-1 block">Year</label>
                          <input
                            id={`cert-year-${cert.id}`}
                            type="text"
                            placeholder="2024"
                            value={cert.year}
                            onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm transition outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCertification}
                    className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Certification
                  </button>
                </div>
              )}
            </div>

            {/* JOB DESCRIPTION KEYWORD MATCHER */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleSection('jobDesc')}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Job Description Matcher</h4>
                    <p className="text-xs text-slate-600">Identify missing keywords from the target role</p>
                  </div>
                </div>
                {sectionsOpen.jobDesc ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
              </button>

              {sectionsOpen.jobDesc && (
                <div className="px-5 pb-5 pt-1 space-y-4.5 border-t border-slate-200">
                  <div>
                    <label htmlFor="jd-matcher-textarea" className="text-xs font-medium text-slate-600 mb-1.5 block">Paste Target Job Description</label>
                    <textarea
                      id="jd-matcher-textarea"
                      rows={5}
                      placeholder="We are looking for a Senior Software Engineer with deep React, AWS, Docker and SQL experience..."
                      value={state.jobDescription}
                      onChange={(e) => updateResumeState(prev => ({ ...prev, jobDescription: e.target.value }))}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 px-3.5 py-2.5 rounded-lg text-sm transition-all outline-none resize-y"
                    />
                  </div>

                  {state.jobDescription && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        Keyword Comparison Analysis
                      </h5>
                      {missingKeywords.length === 0 ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3.5 flex items-start gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <p className="text-xs text-slate-800">
                            Excellent! No high-frequency keywords are missing from your resume state.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-600">
                            The following keywords appear in the job description but are <strong className="text-red-600">missing</strong> from your resume. Try incorporating them:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {missingKeywords.map((word, i) => (
                              <span
                                key={i}
                                className="text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20 px-2.5 py-1 rounded-full"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* RIGHT PANEL: LIVE PREVIEW & ATS SCOREBOARD */}
        <section 
          className={`flex-1 md:w-1/2 bg-slate-50 flex flex-col overflow-y-auto ${activeMobileTab === 'preview' ? 'block' : 'hidden md:flex'}`}
        >
          {/* TOP ACTIONS / PANEL CONTROLS */}
          <div className="sticky top-0 z-35 bg-white/90 backdrop-blur border-b border-slate-200 p-5 space-y-4">
            
            {/* Visual template selector */}
            <div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2.5">Select Layout Template</span>
              <div className="grid grid-cols-3 gap-3">
                {(['classic', 'modern', 'executive'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTemplateSelect(t)}
                    className={`border-2 rounded-xl p-3 text-left transition-all relative overflow-hidden group ${state.meta.template === t ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold ${state.meta.template === t ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {t === 'classic' ? 'Classic' : t === 'modern' ? 'Modern Minimal' : 'Executive'}
                      </span>
                      {state.meta.template === t && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      {t === 'classic' && 'Serif headings, centered header, dividers.'}
                      {t === 'modern' && 'Sleek sans-serif, left border accent band.'}
                      {t === 'executive' && 'Uppercase elegant titles, spaced clean.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Export and action triggers */}
            <div className="flex items-center justify-between flex-wrap gap-3 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPlainText}
                  className="text-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
                >
                  {copiedTextStatus ? <CopyCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                  {copiedTextStatus ? 'Copied!' : 'Copy Plain Text'}
                </button>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center gap-2"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExporting ? 'Generating PDF...' : 'Export PDF'}
              </button>
            </div>
          </div>

          {/* ATS LIVE SCORE PANEL */}
          <div className="px-6 py-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Real-time ATS Score</h4>
                  <p className="text-xs text-slate-600">Live optimization metrics feedback</p>
                </div>
                <div className={`text-2xl font-extrabold ${getScoreTextClass(score)}`}>
                  {score} <span className="text-xs text-slate-500 font-semibold">/ 100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getScoreColorClass(score)}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>

              {/* Checklist details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                    )}
                    <span className={`truncate ${item.passed ? 'text-slate-700' : 'text-slate-500'}`}>
                      {item.label} <span className="text-[10px] text-slate-600">({item.points} pts)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DYNAMIC LIVE TEMPLATE PREVIEW CONTAINER (Styled like an A4 page) */}
          <div className="flex-1 p-6 md:p-8 flex justify-center bg-slate-50">
            <div 
              id="resume-a4-sheet"
              className={`w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[12mm] shadow-2xl relative select-text text-[8.75pt] leading-snug transition-all duration-300 ${state.meta.template === 'classic' ? 'font-serif' : 'font-sans'}`}
              style={{
                fontSize: '8.75pt',
                color: '#1e293b'
              }}
            >
              {/* ACCENT COLORED TOP BAR (ONLY FOR MODERN MINIMAL TEMPLATE) */}
              {state.meta.template === 'modern' && (
                <div 
                  className="absolute top-0 left-0 w-2.5 h-full"
                  style={{ backgroundColor: currentAccent.hex }}
                ></div>
              )}

              {/* DUMMY HELPER DATA OR RENDER STATE */}
              {(() => {
                const h = {
                  name: state.header.name || SAMPLE_DATA.header.name,
                  title: state.header.title || SAMPLE_DATA.header.title,
                  email: state.header.email || SAMPLE_DATA.header.email,
                  phone: state.header.phone || SAMPLE_DATA.header.phone,
                  location: state.header.location || SAMPLE_DATA.header.location,
                  linkedin: state.header.linkedin || SAMPLE_DATA.header.linkedin,
                  portfolio: state.header.portfolio || SAMPLE_DATA.header.portfolio
                };
                const hasEmptyName = !state.header.name;
                const hasEmptyTitle = !state.header.title;
                const hasEmptyContact = !state.header.email && !state.header.phone && !state.header.location;
                const hasEmptyLinks = !state.header.linkedin && !state.header.portfolio;

                const summ = state.summary || SAMPLE_DATA.summary;
                const hasEmptySummary = !state.summary;

                const expList = state.experience.length > 0 ? state.experience : SAMPLE_DATA.experience;
                const hasEmptyExp = state.experience.length === 0;

                const eduList = state.education.length > 0 ? state.education : SAMPLE_DATA.education;
                const hasEmptyEdu = state.education.length === 0;

                const projList = state.projects.length > 0 ? state.projects : SAMPLE_DATA.projects;
                const hasEmptyProj = state.projects.length === 0;

                const skillList = state.skills.length > 0 ? state.skills : SAMPLE_DATA.skills;
                const hasEmptySkill = state.skills.length === 0;

                const certList = state.certifications.length > 0 ? state.certifications : SAMPLE_DATA.certifications;
                const hasEmptyCert = state.certifications.length === 0;

                return (
                  <div className="space-y-3">
                    
                    {/* 1. HEADER */}
                    <div className={`text-center ${state.meta.template === 'modern' ? 'text-left pl-2' : ''}`}>
                      <h2 
                        className={`text-xl font-bold uppercase tracking-tight text-slate-900 ${state.meta.template === 'executive' ? 'tracking-wider font-sans' : ''} ${hasEmptyName ? 'text-slate-400 opacity-60' : ''}`}
                        style={state.meta.template === 'executive' ? { color: currentAccent.hex } : undefined}
                      >
                        {h.name}
                      </h2>
                      <p 
                        className={`text-xs font-bold tracking-wide uppercase text-slate-500 mt-1 ${hasEmptyTitle ? 'text-slate-300 opacity-60' : ''}`}
                      >
                        {h.title}
                      </p>
                      
                      <div className={`flex flex-wrap gap-2 justify-center text-[8pt] text-slate-500 mt-1.5 ${state.meta.template === 'modern' ? 'justify-start' : ''} ${hasEmptyContact ? 'text-slate-300 opacity-60' : ''}`}>
                        {h.email && <span>{h.email}</span>}
                        {h.email && h.phone && <span>•</span>}
                        {h.phone && <span>{h.phone}</span>}
                        {(h.email || h.phone) && h.location && <span>•</span>}
                        {h.location && <span>{h.location}</span>}
                      </div>

                      <div className={`flex flex-wrap gap-2.5 justify-center text-[8pt] text-slate-400 mt-0.5 ${state.meta.template === 'modern' ? 'justify-start' : ''} ${hasEmptyLinks ? 'text-slate-300 opacity-60' : ''}`}>
                        {h.linkedin && (
                          <a href={h.linkedin} target="_blank" rel="noreferrer" className="hover:underline transition text-slate-500 font-medium">
                            LinkedIn
                          </a>
                        )}
                        {h.linkedin && h.portfolio && <span>•</span>}
                        {h.portfolio && (
                          <a href={h.portfolio} target="_blank" rel="noreferrer" className="hover:underline transition text-slate-500 font-medium">
                            Portfolio/GitHub
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Divider for classic */}
                    {state.meta.template === 'classic' && (
                      <div className="border-b border-slate-300 my-1"></div>
                    )}

                    {/* 2. PROFESSIONAL SUMMARY */}
                    <div className="space-y-1">
                      <h3 
                        className={`text-[9.5pt] font-extrabold uppercase tracking-wider ${state.meta.template === 'classic' ? 'text-slate-800' : 'text-slate-900'} ${state.meta.template === 'modern' ? 'border-l-3 pl-2' : ''}`}
                        style={state.meta.template !== 'classic' ? { borderColor: currentAccent.hex } : undefined}
                      >
                        Professional Summary
                      </h3>
                      {state.meta.template === 'executive' && <div className="border-b border-slate-200 pb-0.5 mb-1"></div>}
                      <p className={`text-[8.5pt] leading-snug text-justify ${hasEmptySummary ? 'text-slate-400 opacity-60 italic' : 'text-slate-700'}`}>
                        {summ}
                      </p>
                    </div>

                    {/* 3. EXPERIENCE */}
                    <div className="space-y-2">
                      <h3 
                        className={`text-[9.5pt] font-extrabold uppercase tracking-wider ${state.meta.template === 'classic' ? 'text-slate-800' : 'text-slate-900'} ${state.meta.template === 'modern' ? 'border-l-3 pl-2' : ''}`}
                        style={state.meta.template !== 'classic' ? { borderColor: currentAccent.hex } : undefined}
                      >
                        Experience
                      </h3>
                      {state.meta.template === 'executive' && <div className="border-b border-slate-200 pb-0.5 mb-1.5"></div>}
                      
                      <div className="space-y-2">
                        {expList.map((exp, idx) => (
                          <div key={exp.id || idx} className={`${hasEmptyExp ? 'text-slate-400 opacity-60' : ''}`}>
                            <div className="flex justify-between items-start font-bold text-[8.5pt] text-slate-900">
                              <div>
                                <span>{exp.title || 'Job Title'}</span>
                                {exp.company && <span className="font-normal text-slate-600"> – {exp.company}</span>}
                              </div>
                              <span className="text-[8pt] text-slate-500 font-normal shrink-0">
                                {exp.start || 'Start'} – {exp.current ? 'Present' : (exp.end || 'End')}
                              </span>
                            </div>
                            
                            {exp.location && (
                              <p className="text-[8pt] text-slate-500 italic mt-0.5">{exp.location}</p>
                            )}

                            {exp.bullets && exp.bullets.length > 0 && (
                              <ul className="list-disc pl-4 mt-1 text-[8pt] text-slate-700 space-y-0.5">
                                {exp.bullets.filter(b => b.trim() !== '').map((b, bIdx) => (
                                  <li key={bIdx} className="leading-snug">{b}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5. PROJECTS (Optional in UI) */}
                    {(state.projects.length > 0 || !hasEmptyProj) && (
                      <div className="space-y-2">
                        <h3 
                          className={`text-[9.5pt] font-extrabold uppercase tracking-wider ${state.meta.template === 'classic' ? 'text-slate-800' : 'text-slate-900'} ${state.meta.template === 'modern' ? 'border-l-3 pl-2' : ''}`}
                          style={state.meta.template !== 'classic' ? { borderColor: currentAccent.hex } : undefined}
                        >
                          Projects
                        </h3>
                        {state.meta.template === 'executive' && <div className="border-b border-slate-200 pb-0.5 mb-1.5"></div>}

                        <div className="space-y-2">
                          {projList.map((proj, idx) => (
                            <div key={proj.id || idx} className={`${hasEmptyProj ? 'text-slate-400 opacity-60' : ''}`}>
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-[8.5pt] text-slate-900">
                                  {proj.name || 'Project Name'}
                                  {proj.tech && <span className="font-normal text-slate-500 text-[8pt] ml-1.5">({proj.tech})</span>}
                                </span>
                                {proj.url && (
                                  <a href={proj.url} target="_blank" rel="noreferrer" className="text-[8pt] text-slate-500 hover:underline">
                                    {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                                  </a>
                                )}
                              </div>
                              {proj.description && (
                                <p className="text-[8pt] text-slate-600 mt-0.5 leading-snug">{proj.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 6. SKILLS (Two-Column Layout) */}
                    <div className="space-y-2">
                      <h3 
                        className={`text-[9.5pt] font-extrabold uppercase tracking-wider ${state.meta.template === 'classic' ? 'text-slate-800' : 'text-slate-900'} ${state.meta.template === 'modern' ? 'border-l-3 pl-2' : ''}`}
                        style={state.meta.template !== 'classic' ? { borderColor: currentAccent.hex } : undefined}
                      >
                        Skills
                      </h3>
                      {state.meta.template === 'executive' && <div className="border-b border-slate-200 pb-0.5 mb-1.5"></div>}

                      {/* 2-Column Grid */}
                      <div className={`grid grid-cols-2 gap-4 ${hasEmptySkill ? 'text-slate-400 opacity-60' : ''}`}>
                        <div>
                          <h4 className="text-[8pt] font-bold text-slate-800 uppercase tracking-wide mb-0.5">Technical Skills</h4>
                          <p className="text-[8pt] text-slate-600 leading-snug">
                            {skillList.filter(s => s.group === 'technical').map(s => s.name).join(', ') || 'React, TypeScript, Node.js, JavaScript, Python'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-[8pt] font-bold text-slate-800 uppercase tracking-wide mb-0.5">Tools & Soft Skills</h4>
                          <p className="text-[8pt] text-slate-600 leading-snug font-medium">
                            {(() => {
                              const tools = skillList.filter(s => s.group === 'tools').map(s => s.name).join(', ');
                              const soft = skillList.filter(s => s.group === 'soft').map(s => s.name).join(', ');
                              if (tools && soft) return `${tools}, ${soft}`;
                              return tools || soft || 'Docker, AWS, Git, CI/CD, Agile, Collaboration, Mentorship';
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 7. CERTIFICATIONS */}
                    {(state.certifications.length > 0 || !hasEmptyCert) && (
                      <div className="space-y-2">
                        <h3 
                          className={`text-[9.5pt] font-extrabold uppercase tracking-wider ${state.meta.template === 'classic' ? 'text-slate-800' : 'text-slate-900'} ${state.meta.template === 'modern' ? 'border-l-3 pl-2' : ''}`}
                          style={state.meta.template !== 'classic' ? { borderColor: currentAccent.hex } : undefined}
                        >
                          Certifications
                        </h3>
                        {state.meta.template === 'executive' && <div className="border-b border-slate-200 pb-0.5 mb-1.5"></div>}
                        
                        <div className="space-y-1">
                          {certList.map((cert, idx) => (
                            <div key={cert.id || idx} className={`flex justify-between items-center text-[8pt] ${hasEmptyCert ? 'text-slate-400 opacity-60' : 'text-slate-700'}`}>
                              <p>
                                <span className="font-bold text-slate-900">{cert.name || 'Certification Name'}</span>
                                {cert.org && <span className="text-slate-500"> – {cert.org}</span>}
                              </p>
                              <span className="text-slate-500 font-bold shrink-0">{cert.year || '2024'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. EDUCATION */}
                    <div className="space-y-2">
                      <h3 
                        className={`text-[9.5pt] font-extrabold uppercase tracking-wider ${state.meta.template === 'classic' ? 'text-slate-800' : 'text-slate-900'} ${state.meta.template === 'modern' ? 'border-l-3 pl-2' : ''}`}
                        style={state.meta.template !== 'classic' ? { borderColor: currentAccent.hex } : undefined}
                      >
                        Education
                      </h3>
                      {state.meta.template === 'executive' && <div className="border-b border-slate-200 pb-0.5 mb-1.5"></div>}
                      
                      <div className="space-y-2">
                        {eduList.map((edu, idx) => (
                          <div key={edu.id || idx} className={`flex justify-between items-start ${hasEmptyEdu ? 'text-slate-400 opacity-60' : ''}`}>
                            <div>
                              <p className="font-bold text-[8.5pt] text-slate-900">
                                {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}
                              </p>
                              <p className="text-[8pt] text-slate-600">{edu.institution || 'University Name'}</p>
                            </div>
                            <div className="text-right text-[8pt] text-slate-500 shrink-0">
                              <p className="font-bold">{edu.year || 'Graduation Year'}</p>
                              {edu.gpa && <p className="text-[8pt] text-slate-400">GPA: {edu.gpa}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()}
              
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export type ResumeTemplate = 'classic' | 'modern' | 'executive';

export type AccentColorPreset = 'slate' | 'navy' | 'forest' | 'burgundy' | 'charcoal';

export interface ResumeMeta {
  template: ResumeTemplate;
  accentColor: string;
  accentName: AccentColorPreset;
  targetJobTitle: string;
}

export interface ResumeHeader {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

export type SkillGroup = 'technical' | 'soft' | 'tools';

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
}

export interface Certification {
  id: string;
  name: string;
  org: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
  url?: string;
}

export interface ResumeState {
  meta: ResumeMeta;
  header: ResumeHeader;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  jobDescription: string;
}

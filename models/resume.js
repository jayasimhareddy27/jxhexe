import mongoose from 'mongoose';
import { resumeformatPrompts } from '../public/staticfiles/prompts/resume/schema';
  
const defaultSectionTitles = Object.values(resumeformatPrompts).map(phase => ({
    key: phase.key,
    title: phase.title,
}));

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, default: 'Default Resume by JXH' },
  
  designConfig: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {
      layout: 'primary',
      containers: {},
      selectedContainer: null, 
    } 
  },
  templateId: {
    type: String,
    default: 'template01'   
  },

  personalInformation: { type: mongoose.Schema.Types.Mixed, default: {} },
  onlineProfiles: { type: mongoose.Schema.Types.Mixed, default: {} },

  educationHistory: { type: mongoose.Schema.Types.Mixed, default: [] },
  workExperience: { type: mongoose.Schema.Types.Mixed, default: [] },

  projects: { type: mongoose.Schema.Types.Mixed, default: [] },

  certifications: { type: mongoose.Schema.Types.Mixed, default: [] },

  skillsSummary: { type: mongoose.Schema.Types.Mixed, default: {} },
  careerSummary: { type: mongoose.Schema.Types.Mixed, default: {} },

  addressDetails: { type: mongoose.Schema.Types.Mixed, default: {} },

  resumetextAireference: { type: String, default: "" },

  sectionTitles: {
      type: [{
          key: { type: String, required: true },
          title: { type: String, required: true },
      }],
      default: () => [...defaultSectionTitles]
  },

}, { timestamps: true, strict: false });

export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
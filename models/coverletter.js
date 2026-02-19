import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },

  resumeId: {   type: mongoose.Schema.Types.ObjectId,   ref: 'Resume',   default: null },
  jobId: {   type: mongoose.Schema.Types.ObjectId,   ref: 'Job',  default: null },

  name: { type: String, required: true, default: 'Default Cover letter by JXH' },
  designConfig: { type: mongoose.Schema.Types.Mixed, default: {layout: 'primary',containers: {},selectedContainer: null, } },
  
  templateId: {type: String,default: 'template01'},

  personalInformation: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  onlineProfiles: { type: mongoose.Schema.Types.Mixed, default: {} },

  
  recipientInformation: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },

  letterMeta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  letterContent: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  bodyParagraphs: { type: mongoose.Schema.Types.Mixed, default: [] },

  signOff: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
    
}, { timestamps: true, strict: false });

export default mongoose.models.CoverLetter || mongoose.model('CoverLetter', coverLetterSchema);
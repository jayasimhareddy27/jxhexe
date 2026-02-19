import mongoose from 'mongoose';

const FollowUpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true // Added index for fast lookups on the Job Details page
  },
  companyName: { type: String, required: true },
  position: { type: String, required: true },
  
  // --- CONTENT ---
  message: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['email', 'linkedin', 'phone', 'other'], 
    default: 'email' 
  },
  
  // --- SCHEDULING ---
  followUpDateTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'missed'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Optimized for the Home Screen: "What is due today?"
FollowUpSchema.index({ userId: 1, status: 1, followUpDateTime: 1 });

export default mongoose.models.FollowUp || mongoose.model('FollowUp', FollowUpSchema);
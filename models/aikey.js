import mongoose from 'mongoose'

const aikeySchema = new mongoose.Schema({
  agent: { type: String, default: null },
  provider: { type: String, default: null },
  apiKey: { type: String, default: null },
  loading: { type: String, default: 'idle' },
  error: { type: String, default: null }
}, { _id: true })

export default aikeySchema

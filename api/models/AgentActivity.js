import mongoose from 'mongoose'

const AgentActivitySchema = new mongoose.Schema({
    sessionId: { type: String, default: 'N/A' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    command: { type: String, required: true },
    intent: { type: String },
    // agentTrail을 문자열 배열에서 정교한 객체 배열로 격상
    agentTrail: [{
        agent: String,
        task: String,
        thought: String,
        observation: String,
        timestamp: { type: Date, default: Date.now }
    }],
    reasoning: { type: String },
    observation: { type: String },
    finalResponse: { type: String },
    durationMs: { type: Number },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('AgentActivity', AgentActivitySchema)

import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema({

    timestamp: { type: Date },
    status: { type: String },
    requested_at: { type: Date },
    answered_at: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId, red: 'Player' },
    category: { type: String },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    },

}, { timestamps: true, collection: 'challenges' })
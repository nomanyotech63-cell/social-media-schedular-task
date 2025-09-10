const mongoose = require('mongoose');

// === Post SCHEMA AND MODEL ===
const postsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    media_url: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true,
        default: "Twitter",
        enum: ["Twitter", "Facebook", "LinkedIn"]
    },
    scheduled_at: {
        type: Date,
        default: Date.now
    },
    status: {
      type: String,
      trim: true,
      lowercase: true,
      default: "scheduled",
      enum: ["scheduled", "published", "failed"],
    },    
},  { timestamps: { createdAt: true, updatedAt: false }});

const Posts = mongoose.model('Posts', postsSchema);

module.exports = Posts;

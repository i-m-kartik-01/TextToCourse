const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // The unique ID from Auth0 (usually looks like "google-oauth2|12345...")
  auth0Id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  name: String,
  picture: String,
  
  // App-specific data
  generatedCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
}, { timestamps: true });
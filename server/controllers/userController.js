const User = require('../models/userModel');

const syncUser = async (req, res) => {
  try {
    // These fields will come from the Auth0 'user' object in your React frontend
    const { auth0Id, email, name, picture } = req.body; 

    if (!auth0Id) return res.status(400).json({ message: "Auth0 ID is required" });

    // Find user by auth0Id and update their info, or create if not found
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { email, name, picture }, 
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error("User Sync Error:", error);
    res.status(500).json({ message: "Failed to sync user data" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // req.auth.payload.sub is the ID extracted from the JWT Access Token
    const user = await User.findOne({ auth0Id: req.auth.payload.sub })
      .populate('generatedCourses'); 
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};

module.exports = { syncUser, getUserProfile };
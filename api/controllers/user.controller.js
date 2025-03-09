///export const test=(req,res)=>{
   res.json({
      message:'Hello !'
});

import express from "express";
import User from "../models/user.model.js"; // Import user model

const router = express.Router();

// 📌 Route to update profile (including image)
router.put("/update/:id", async (req, res) => {
    const { avatar } = req.body; // Get uploaded image URL from frontend
    console.log("Received update request for user:", req.params.id);
    console.log("Received avatar URL:", avatar); // Log the received image URL
  
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        console.log("User not found!");
        return res.status(404).json({ message: "User not found" });
      }
  
      user.avatar = avatar; // 🔹 Save new profile picture URL
      await user.save();
      console.log("Profile updated successfully!");
  
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile", error });
    }
  });
  

export default router;

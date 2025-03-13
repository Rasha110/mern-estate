import express from 'express'
import {signup,signin,google} from '../controllers/auth.controller.js'

const router=express.Router();
router.post('/signup',signup);
// router.post('/signin',signin);
router.post('/google',google);
router.post("/signin", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ _id: user._id, email: user.email, username: user.username });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
 
export default router;
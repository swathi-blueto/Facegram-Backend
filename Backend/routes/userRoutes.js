import express from "express";
import { getUserProfile,updateProfile } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";



const router=express.Router();

router.get("/:id", getUserProfile);

router.put("/:id", upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 }
  ]), updateProfile);

export default router;
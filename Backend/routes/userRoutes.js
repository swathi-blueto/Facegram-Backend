import express from "express";
import { getUserProfile,updateProfile,searchUsers } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authenticate.js";


const router=express.Router();

router.get("/search", authenticate,searchUsers);
router.get("/:id", getUserProfile);

router.put("/:id",authenticate, upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 }
  ]), updateProfile);



export default router;
import { userProfile } from "../services/userService.js";


export const getUserProfile=async(req,res)=>{
    try {
      const id=req.params.id;
      const response=await userProfile({id});
      res.status(200).send({ message: "User Profile Fetched Successfully", data: response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
}

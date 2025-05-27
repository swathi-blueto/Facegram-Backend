import {
    sendFriendRequestService,
    acceptFriendRequestService,
    cancelFriendRequestService,
    removeFriendService,
    getPotentialFriends,
    getPendingFriendRequests,
    getReceivedFriendRequests,
    getFriend
  } from "../services/friendService.js";
  
  // Send friend request
  export const sendFriendRequest = async (req, res) => {
    try {
      const senderId = req.user.id; 
      const receiverId = req.params.userId;
  
      const response = await sendFriendRequestService(senderId, receiverId);
      res.status(201).send({ message: "Friend request sent", data: response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  
  // Accept friend request
  export const acceptFriendRequest = async (req, res) => {
    try {
      const receiverId = req.user.id;
      const senderId = req.params.userId;

      const response = await acceptFriendRequestService(senderId, receiverId);
      res.status(200).send({ message: "Friend request accepted", data: response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  
  // Cancel friend request
  export const cancelFriendRequest = async (req, res) => {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.userId;
  
      console.log(senderId,receiverId)
      const response = await cancelFriendRequestService(senderId, receiverId);
      res.status(200).send({ message: "Friend request cancelled", data: response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  
  // Remove friend
  export const removeFriend = async (req, res) => {
    try {
      const userId = req.user.id;
      const friendId = req.params.userId;
  
      const response = await removeFriendService(userId, friendId);
      res.status(200).send({ message: "Friend removed", data: response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  

export const getFriends =async(req,res)=>{
  try{
    const userId = req.user.id;
    const response=await getPotentialFriends(userId);
   
    res.status(200).send({ message: "Fethched succesfully", data: response });
  }
  catch(err){
     res.status(400).send({ error: err.message });
  }
}


export const getPendingFriendReq =async(req,res)=>{
  try{
    const userId = req.user.id;
    const response=await getPendingFriendRequests(userId);
   
    res.status(200).send({ message: "Fethched succesfully", data: response });
  }
  catch(err){
     res.status(400).send({ error: err.message });
  }
}

export const getReceivedFriendReq =async(req,res)=>{
  try{
    const userId = req.user.id;
    const response=await getReceivedFriendRequests(userId);
   
    res.status(200).send({ message: "Fethched succesfully", data: response });
  }
  catch(err){
     res.status(400).send({ error: err.message });
  }
}



export const acceptedFriends =async(req,res)=>{
  try {
    const userId=req.user.id;
    const response=await getFriend(userId);
    res.status(200).send({ message: "Fethched succesfully", data: response });
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
}
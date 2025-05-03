import { Login, Signup,Logout } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { first_name, last_name,email,password } = req.body;
    
    const response = await Signup({ first_name, last_name,email,password});
    res.status(201).send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await Login({ email, password });
    res.status(200).send(response);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};


export const logout=async(req,res)=>{
  try {
    const res=await Logout();
    res.status(200).send(res)
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}
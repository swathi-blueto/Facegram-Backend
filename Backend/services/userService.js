import { supabase } from "../config/db.js";


export const userProfile = async ({ id }) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single(); 
  
      if (error) {
        throw new Error("Failed to fetch user profile: " + error.message);
      }
  
      return data;
    } catch (error) {
      console.error("userProfile error:", error.message);
      throw error;
    }
  };
  
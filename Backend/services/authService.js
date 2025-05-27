import { supabase } from "../config/db.js";

export const Signup = async ({ first_name, last_name, email, password }) => {
  try {
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error("Signup failed: " + authError.message);

    const user_id = authUser?.user?.id;
    if (!user_id) throw new Error("No user ID returned from auth");

    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (existingError)
      throw new Error("Error checking user: " + existingError.message);
    if (existingUser.length > 0)
      throw new Error("User already exists with this email");

    const { data, error } = await supabase
      .from("users")
      .insert([{ id: user_id, first_name, last_name, email, role: "user" }])
      .select();

    if (error) throw new Error("Signup failed: " + error.message);

    return {
      message: "Registered Successfully",
      data: { first_name, last_name, email },
    };
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};

// export const Login = async ({ email, password }) => {
//   try {
//     const { data: authUser, error: authError } =
//       await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       // console.log(authUser.session.access_token);

//     if (authError) throw new Error("Login failed: " + authError.message);
    

//     const { data: userProfile, error: profileError } = await supabase
//       .from("users")
//       .select("id, first_name, last_name, email, role")
//       .eq("email", email)
//       .single();

//     if (profileError) throw new Error("Failed to fetch user profile");

//     return { email: authUser.user, role: userProfile.role };
//   } catch (error) {
//     throw error;
//   }
// };

export const Login = async ({ email, password }) => {
  try {
    
    const { data: authUser, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    
    if (authError) throw new Error("Login failed: " + authError.message);

   
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, role")
      .eq("email", email)
      .single();

    
    if (profileError) throw new Error("Failed to fetch user profile");

    
    return {
      token: authUser.session.access_token,  
      email: authUser.user.email,  
      id:authUser.user.id,
      role: userProfile.role,
      firstName: userProfile.first_name,  
      lastName: userProfile.last_name,  
    };
  } catch (error) {
    
    throw error;
  }
};


export const Logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("Logout failed: " + error.message);
    }

    return { message: "Logout successful" };
  } catch (error) {
    console.error("Logout error:", error.message);
    return { error: error.message };
  }
};

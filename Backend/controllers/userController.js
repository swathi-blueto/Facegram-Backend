import { userProfile ,updateProfileUser,searchUsersService} from "../services/userService.js";
import { profileSchema } from "../validations/validations.js";


export const updateProfile = async (req, res) => {
  try {
    let id = req.params.id;

     if (id.startsWith(':')) {
      id = id.slice(1);
    }



    console.log('Received user ID:', req.params.id);


    const {
      phone,
      gender,
      date_of_birth,
      city,
      country,
      hometown,
      bio,
      work,
      education,
      relationship_status
    } = req.body;

    const profile_pic = req.files?.profile_pic?.[0];
    const cover_photo = req.files?.cover_photo?.[0];

    
    const { error } = profileSchema.validate(
      {
        id,
        phone,
        gender,
        date_of_birth,
        city,
        country,
        hometown,
        bio,
        // website,
        work,
        education,
        relationship_status,
        profile_pic,
        cover_photo
      },
      { abortEarly: false } 
    );

    
    if (error) {
      return res.status(400).send({
        error: error.details.map((err) => err.message)
      });
    }

   
    const response = await updateProfileUser({
      id,
      phone,
      gender,
      date_of_birth,
      city,
      country,
      hometown,
      bio,
      // website,
      work,
      education,
      relationship_status,
      profile_pic,
      cover_photo
    });

    res.status(200).send({ message: "Profile updated successfully", data: response });

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await userProfile({ id });
    res
      .status(200)
      .send({
        message:
          response.role === "admin"
            ? "Admin Profile Fetched Successfully"
            : "User Profile Fetched Successfully",
        data: response,
      });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const results = await searchUsersService(query);
    console.log(results,"res")
    res.status(200).json({ message: "Search successful", data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
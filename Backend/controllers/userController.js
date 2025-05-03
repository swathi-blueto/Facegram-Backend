import { userProfile ,updateProfileUser} from "../services/userService.js";
import { profileSchema } from "../validations/userValidations.js";


export const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      phone,
      gender,
      date_of_birth,
      city,
      country,
      hometown,
      bio,
      website,
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
        website,
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
      website,
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

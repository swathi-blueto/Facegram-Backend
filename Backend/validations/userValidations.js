import Joi from "joi";

export const signupSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).required(),
  last_name: Joi.string().min(1).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const profileSchema = Joi.object({
  id: Joi.string().required(),
  phone: Joi.string().pattern(/^\d{10}$/).allow(null, ''),
  gender: Joi.string().valid("male", "female", "other").allow(null, ''),
  date_of_birth: Joi.date().less('now').iso().allow(null),
  city: Joi.string().max(50).allow(null, ''),
  country: Joi.string().max(50).allow(null, ''),
  hometown: Joi.string().max(50).allow(null, ''),
  bio: Joi.string().max(300).allow(null, ''),
  website: Joi.string().uri().allow(null, ''),
  work: Joi.string().max(100).allow(null, ''),
  education: Joi.string().max(100).allow(null, ''),
  relationship_status: Joi.string().valid("single", "married", "in a relationship", "other").allow(null, ''),
  profile_pic: Joi.any(),
  cover_photo: Joi.any()
});

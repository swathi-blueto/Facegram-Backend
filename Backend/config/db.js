
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
dotenv.config()

const supabaseUrl = process.env.SUPABASEURL; 
const supabaseKey = process.env.SUPABASEKEY;


export const supabase = createClient(supabaseUrl, supabaseKey);


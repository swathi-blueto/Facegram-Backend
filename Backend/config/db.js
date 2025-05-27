import { createClient } from '@supabase/supabase-js';
import { RealtimeClient } from '@supabase/realtime-js';
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASEURL; 
const supabaseKey = process.env.SUPABASEKEY;


const realtimeOptions = {
  realtime: {
    params: {
      eventsPerSecond: 10, 
    },
  },
};

export const supabase = createClient(
  supabaseUrl, 
  supabaseKey,
  {
    realtime: realtimeOptions
  }
);
import { createClient } from '@supabase/supabase-js'

// Define types for our data entities
export interface Application {
  id?: string
  created_at?: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  address: string
  grade_level: string
  parent_name: string
  parent_email: string
  parent_phone: string
  message?: string
  status?: string
  campus?: string
  boarding?: string
  // Additional fields required by the application form
  relationship?: string
  student_name?: string
  previous_school?: string
  special_needs?: string
  how_heard?: string
  application_status?: string
  payment_status?: string
  payment_confirmation_code?: string
  payment_amount?: number
  payment_currency?: string
  payment_date?: string
}

export interface Message {
  id?: string
  created_at?: string
  name: string
  email: string
  subject: string
  message: string
  read?: boolean
}

export interface Resource {
  id?: string
  created_at?: string
  title: string
  description: string
  file_url?: string
  file_name?: string
  category?: string
}

export interface Announcement {
  id?: string
  created_at?: string
  title: string
  content: string
  published_at?: string
  author?: string
  image_url?: string
  cta_text?: string
  cta_link?: string
  category?: string
  pinned?: boolean
}

export interface Event {
  id?: string
  created_at?: string
  title: string
  description: string
  start_date: string
  end_date?: string
  location?: string
  is_all_day?: boolean
}

export interface GalleryImage {
  id?: string
  created_at?: string
  title: string
  file_url: string
  file_name: string
  alt_text?: string
  caption?: string
  category?: string
}

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate that environment variables are set
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
}
if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a function to get admin client only when needed (server-side)
let supabaseAdminInstance: any = null;
export const getSupabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    if (!supabaseServiceRoleKey) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Using anon client for admin operations—ensure database policies permit this.');
      supabaseAdminInstance = supabase;
    } else {
      supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey);
    }
  }
  return supabaseAdminInstance;
}
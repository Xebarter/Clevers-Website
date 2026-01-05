# Supabase Setup Guide

This document explains how to set up Supabase for the Clevers' Origin Schools website.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. A Supabase project created

## Database Schema

Create the following tables in your Supabase database:

### Applications Table

```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT,
  grade_level TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending'
);
```

### Messages Table

```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);
```

### Resources Table

```sql
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  category TEXT
);
```

### Announcements Table

```sql
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT
);
```

### Events Table

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  is_all_day BOOLEAN DEFAULT FALSE
);
```

### Gallery Images Table

```sql
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  category TEXT
);
```

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Authentication (Optional)

If you want to add authentication for admin features, you can set up Supabase Auth:

1. Enable Email authentication in Supabase Auth settings
2. Create admin users manually in the Supabase dashboard
3. Configure Row Level Security (RLS) policies as needed

## Storage (Optional)

If you want to use Supabase Storage for file uploads:

1. Create buckets for different types of files:
   - Create a bucket named `announcements` for announcement images
   - Create a bucket named `gallery-images` for gallery images
   - Create a bucket named `resources` for resource files

2. Configure bucket permissions:
   - For each bucket, set the policy to "Public" to allow public read access
   - Keep write access restricted to authenticated users or admins

3. Update the services to use Supabase Storage APIs

## Updating Services

The services have been updated to use Supabase instead of Sanity for all data operations:

- Applications
- Messages
- Resources
- Announcements
- Events
- Gallery Images

All CRUD operations are now handled through Supabase.
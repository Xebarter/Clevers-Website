import { supabase, Application, Message, Resource, Announcement, Event, GalleryImage } from './client'
import { getSupabaseAdmin } from './client'

// Export the types
export type { Application, Message, Resource, Announcement, Event, GalleryImage }

// Applications service
export const applicationsService = {
  // Get all applications
  getAll: async (): Promise<Application[]> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get application by ID
  getById: async (id: string): Promise<Application | null> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new application
  create: async (application: Omit<Application, 'id' | 'created_at'>): Promise<Application> => {
    const { data, error } = await getSupabaseAdmin()
      .from('applications')
      .insert(application)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Update application
  update: async (id: string, updates: Partial<Application>): Promise<Application> => {
    const { data, error } = await getSupabaseAdmin()
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Delete application
  delete: async (id: string): Promise<void> => {
    const { error } = await getSupabaseAdmin()
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Messages service
export const messagesService = {
  // Get all messages
  getAll: async (): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get message by ID
  getById: async (id: string): Promise<Message | null> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new message
  create: async (message: Omit<Message, 'id' | 'created_at' | 'read'>): Promise<Message> => {
    // Try inserting with `read: false` for schemas that include the column.
    // If the DB schema doesn't have `read`, retry without it and return that result.
    const client = getSupabaseAdmin()

    // Debug: indicate whether we're using the anon client for admin ops
    try {
      console.log('messagesService.create - using anon client for admin ops:', client === supabase)
    } catch (e) {
      // ignore
    }

    const attemptWithRead = await client
      .from('messages')
      .insert({ ...message, read: false })
      .select()
      .single()

    console.log('messagesService.create - attemptWithRead result:', { data: attemptWithRead.data, error: attemptWithRead.error && attemptWithRead.error.message })

    if (!attemptWithRead.error) {
      return attemptWithRead.data!
    }

    // If the error indicates the `read` column is missing, retry without it.
    const errMsg = String(attemptWithRead.error.message || attemptWithRead.error)
    if (errMsg.includes("Could not find the 'read' column") || /read column/i.test(errMsg)) {
      const attemptWithoutRead = await client
        .from('messages')
        .insert(message)
        .select()
        .single()

      console.log('messagesService.create - attemptWithoutRead result:', { data: attemptWithoutRead.data, error: attemptWithoutRead.error && attemptWithoutRead.error.message })

      if (attemptWithoutRead.error) throw attemptWithoutRead.error
      return attemptWithoutRead.data!
    }

    // Otherwise throw the original error
    throw attemptWithRead.error
  },

  // Update message
  update: async (id: string, updates: Partial<Message>): Promise<Message> => {
    const { data, error } = await getSupabaseAdmin()
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Delete message
  delete: async (id: string): Promise<void> => {
    const { error } = await getSupabaseAdmin()
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Resources service
export const resourcesService = {
  // Get all resources
  getAll: async (): Promise<Resource[]> => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get resource by ID
  getById: async (id: string): Promise<Resource | null> => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new resource
  create: async (resource: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> => {
    const { data, error } = await getSupabaseAdmin()
      .from('resources')
      .insert(resource)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Update resource
  update: async (id: string, updates: Partial<Resource>): Promise<Resource> => {
    const { data, error } = await getSupabaseAdmin()
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Delete resource
  delete: async (id: string): Promise<void> => {
    const { error } = await getSupabaseAdmin()
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Announcements service
export const announcementsService = {
  // Get all announcements
  getAll: async (): Promise<Announcement[]> => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get announcement by ID
  getById: async (id: string): Promise<Announcement | null> => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new announcement
  create: async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
    const { data, error } = await getSupabaseAdmin()
      .from('announcements')
      .insert(announcement)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Update announcement
  update: async (id: string, updates: Partial<Announcement>): Promise<Announcement> => {
    const { data, error } = await getSupabaseAdmin()
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Delete announcement
  delete: async (id: string): Promise<void> => {
    const { error } = await getSupabaseAdmin()
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Events service
export const eventsService = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get event by ID
  getById: async (id: string): Promise<Event | null> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new event
  create: async (event: Omit<Event, 'id' | 'created_at'>): Promise<Event> => {
    const { data, error } = await getSupabaseAdmin()
      .from('events')
      .insert(event)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Update event
  update: async (id: string, updates: Partial<Event>): Promise<Event> => {
    const { data, error } = await getSupabaseAdmin()
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    const { error } = await getSupabaseAdmin()
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Gallery images service
export const galleryService = {
  // Get all gallery images
  getAll: async (): Promise<GalleryImage[]> => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get gallery image by ID
  getById: async (id: string): Promise<GalleryImage | null> => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Get gallery images by category
  getByCategory: async (category: string): Promise<GalleryImage[]> => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new gallery image
  create: async (image: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> => {
    const { data, error } = await getSupabaseAdmin()
      .from('gallery_images')
      .insert(image)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Update gallery image
  update: async (id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> => {
    const { data, error } = await getSupabaseAdmin()
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  // Delete gallery image
  delete: async (id: string): Promise<void> => {
    const { error } = await getSupabaseAdmin()
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
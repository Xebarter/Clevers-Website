import { NextRequest, NextResponse } from 'next/server';
import { hallOfFameService, type HallOfFame } from '../../../../../lib/supabase/services';

// GET /api/admin/hall-of-fame - Get all hall of fame entries (including unpublished)
export async function GET(request: NextRequest) {
  try {
    const entries = await hallOfFameService.getAllAdmin();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching hall of fame entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hall of fame entries' },
      { status: 500 }
    );
  }
}

// POST /api/admin/hall-of-fame - Create a new hall of fame entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.learner_names || !body.achievement || !body.achievement_date || !body.image_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, learner_names, achievement, achievement_date, image_url' },
        { status: 400 }
      );
    }

    // Create the entry
    const entryData: Omit<HallOfFame, 'id' | 'created_at' | 'updated_at'> = {
      title: body.title,
      learner_names: body.learner_names,
      achievement: body.achievement,
      achievement_date: body.achievement_date,
      image_url: body.image_url,
      image_alt_text: body.image_alt_text,
      category: body.category,
      grade_level: body.grade_level,
      campus: body.campus,
      description: body.description,
      recognition_details: body.recognition_details,
      is_featured: body.is_featured ?? false,
      display_order: body.display_order ?? 0,
      is_published: body.is_published ?? true,
      tags: body.tags
    };

    const newEntry = await hallOfFameService.create(entryData);
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating hall of fame entry:', error);
    return NextResponse.json(
      { error: 'Failed to create hall of fame entry' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { hallOfFameService, type HallOfFame } from '../../../../../../lib/supabase/services';

// GET /api/admin/hall-of-fame/[id] - Get a specific hall of fame entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entry = await hallOfFameService.getById(params.id);
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Hall of fame entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching hall of fame entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hall of fame entry' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/hall-of-fame/[id] - Update a hall of fame entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Build update object with only provided fields
    const updates: Partial<HallOfFame> = {};
    
    if (body.title !== undefined) updates.title = body.title;
    if (body.learner_names !== undefined) updates.learner_names = body.learner_names;
    if (body.achievement !== undefined) updates.achievement = body.achievement;
    if (body.achievement_date !== undefined) updates.achievement_date = body.achievement_date;
    if (body.image_url !== undefined) updates.image_url = body.image_url;
    if (body.image_alt_text !== undefined) updates.image_alt_text = body.image_alt_text;
    if (body.category !== undefined) updates.category = body.category;
    if (body.grade_level !== undefined) updates.grade_level = body.grade_level;
    if (body.campus !== undefined) updates.campus = body.campus;
    if (body.description !== undefined) updates.description = body.description;
    if (body.recognition_details !== undefined) updates.recognition_details = body.recognition_details;
    if (body.is_featured !== undefined) updates.is_featured = body.is_featured;
    if (body.display_order !== undefined) updates.display_order = body.display_order;
    if (body.is_published !== undefined) updates.is_published = body.is_published;
    if (body.tags !== undefined) updates.tags = body.tags;

    const updatedEntry = await hallOfFameService.update(params.id, updates);
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating hall of fame entry:', error);
    return NextResponse.json(
      { error: 'Failed to update hall of fame entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/hall-of-fame/[id] - Delete a hall of fame entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await hallOfFameService.delete(params.id);
    return NextResponse.json({ success: true, message: 'Hall of fame entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting hall of fame entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete hall of fame entry' },
      { status: 500 }
    );
  }
}

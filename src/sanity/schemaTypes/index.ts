import { type SchemaTypeDefinition } from 'sanity';

// Import individual schema files
import announcement from './announcements';
import calendarEvent from './calendarEvent';
import event from './event';
import galleryImage from './galleryImage';
import resources from './resources';
import application from './application'; // Ensure this points to application.ts

// If you're using default exports in your schema files:
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    announcement,
    calendarEvent,
    event,
    galleryImage,
    resources,
    application,
  ],
};
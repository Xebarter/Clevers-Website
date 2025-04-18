// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity';

// Import individual schema files
import announcement from './announcements';
import calendarEvent from './calendarEvent';
import event from './event';
import galleryImage from './galleryImage';
import resources from './resources';

// If you're using default exports in your schema files:
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    announcement,
    calendarEvent,
    event,
    galleryImage,
    resources,
    // Add more schemas here
  ],
};

// Alternative if you're using named exports:
// import { announcement } from './announcement';
// import { calendarEvent } from './calendarEvent';
// ...etc
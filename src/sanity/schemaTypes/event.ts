// sanity/schemas/event.ts
import { defineField, defineType } from 'sanity';
import { StringRule, DateRule } from '@sanity/types';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule: DateRule) => Rule.required()
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g., "8:00 AM - 4:00 PM"',
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Academic', value: 'academic' },
          { title: 'Sports', value: 'sports' },
          { title: 'Cultural', value: 'cultural' },
          { title: 'Holiday', value: 'holiday' },
          { title: 'Community', value: 'community' }
        ],
        layout: 'dropdown'
      },
      validation: (Rule: StringRule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      type: 'type'
    },
    prepare(selection) {
      const { title, date, type } = selection;
      return {
        title: title,
        subtitle: `${date} • ${type}`.toUpperCase()
      };
    }
  }
});
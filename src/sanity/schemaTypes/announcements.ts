// sanity/schemaTypes/announcements.ts
import { defineField, defineType } from 'sanity';
import { StringRule } from '@sanity/types';

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule: StringRule) => rule.required()
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: (rule: StringRule) => rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required() // Type inferred automatically for date fields
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Academic', value: 'academic' },
          { title: 'Event', value: 'event' },
          { title: 'Achievement', value: 'achievement' },
          { title: 'Community', value: 'community' }
        ],
        layout: 'dropdown'
      },
      validation: (rule: StringRule) => rule.required()
    }),
    defineField({
      name: 'pinned',
      title: 'Pinned',
      type: 'boolean',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      category: 'category'
    },
    prepare(selection) {
      const { title, date, category } = selection;
      return {
        title,
        subtitle: `${date} • ${category}`.toUpperCase()
      };
    }
  }
});
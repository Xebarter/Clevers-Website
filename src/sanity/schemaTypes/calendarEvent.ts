// sanity/schemas/calendarEvent.ts
import { defineField, defineType } from 'sanity';
import { StringRule, DateRule, BooleanRule } from '@sanity/types';

export default defineType({
  name: 'calendarEvent',
  title: 'Calendar Event',
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
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (Rule: DateRule) => Rule.required()
    }),
    defineField({
      name: 'endDate',
      title: 'End Date (if multi-day)',
      type: 'datetime',
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g., "14:00 - 17:00"'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Academic', value: 'academic' },
          { title: 'Exam', value: 'exam' },
          { title: 'Event', value: 'event' }
        ],
        layout: 'dropdown'
      },
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'isImportant',
      title: 'Important Event',
      type: 'boolean',
      description: 'Should this event be highlighted?',
      initialValue: false,
      validation: (Rule: BooleanRule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      category: 'category'
    },
    prepare(selection) {
      const { title, startDate, category } = selection;
      return {
        title,
        subtitle: `${new Date(startDate).toLocaleDateString()} • ${category}`.toUpperCase()
      };
    }
  }
});
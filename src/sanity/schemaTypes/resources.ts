// src/sanity/schemaTypes/resources.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Academic Materials', value: 'academic' },
          { title: 'Forms & Applications', value: 'forms' },
          { title: 'School Policies', value: 'policies' },
          { title: 'Calendars & Schedules', value: 'calendar' },
          { title: 'Newsletters', value: 'newsletters' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'File Type (e.g., pdf, docx, xlsx)',
      type: 'string',
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size (e.g., 2.1 MB)',
      type: 'string',
    }),
    defineField({
      name: 'uploadDate',
      title: 'Upload Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File Upload',
      type: 'file',
      options: {
        accept:
          'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})

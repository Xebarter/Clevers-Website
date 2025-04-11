// sanity/schemas/galleryImage.ts 
import { defineField, defineType } from 'sanity';
import { ImageRule, StringRule, DateRule } from '@sanity/types';

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: ImageRule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Events', value: 'events' },
          { title: 'Campus', value: 'campus' },
          { title: 'Students', value: 'students' },
          { title: 'Sports', value: 'sports' },
          { title: 'Activities', value: 'activities' }
        ],
        layout: 'dropdown'
      },
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Date Taken',
      type: 'date',
      validation: (Rule: DateRule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      category: 'category'
    },
    prepare(selection) {
      const { title, media, category } = selection;
      return {
        title,
        media,
        subtitle: category?.toUpperCase()
      };
    }
  }
});

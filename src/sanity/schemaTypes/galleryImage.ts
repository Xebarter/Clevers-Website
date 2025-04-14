// sanity/schemas/galleryImage.ts
import { defineField, defineType } from 'sanity';
import { StringRule, DateRule, ArrayRule } from '@sanity/types';

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required(), // Validate each image
        },
      ],
      validation: (Rule: ArrayRule<any>) => Rule.required().min(1), // Validate the array
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
          { title: 'Activities', value: 'activities' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Campus Location',
      type: 'string',
      options: {
        list: [
          { title: 'Kitintale', value: 'kitintale' },
          { title: 'Kasokoso', value: 'kasokoso' },
          { title: 'Maganjo', value: 'maganjo' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date Taken',
      type: 'date',
      validation: (Rule: DateRule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      category: 'category',
      location: 'location',
    },
    prepare(selection) {
      const { title, media, category, location } = selection;
      return {
        title,
        media,
        subtitle: `${category?.toUpperCase()} - ${location?.charAt(0).toUpperCase() + location?.slice(1)}`,
      };
    },
  },
});
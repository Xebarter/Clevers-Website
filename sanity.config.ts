import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { deskTool } from 'sanity/desk'
import { SchemaTypeDefinition } from 'sanity'

import { schema } from './src/sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './src/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Clevers Origin Studio',
  basePath: '/CleversBackend',

  projectId,
  dataset,
  apiVersion,

  // Correct schema configuration (choose ONE of these options):
  
  // Option 1: If your schema is already an array of type definitions
  schema: schema,
  
  // OR Option 2: If you need to wrap your schema types
  // schema: {
  //   types: schema,
  //   templates: (prev) => [...prev],
  //   // other schema config options
  // },

  plugins: [
    deskTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
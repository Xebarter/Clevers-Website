import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schema } from './schemaTypes';

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: "Clevers' Origin Schools Studio",
  basePath: '/studio',
  plugins: [deskTool()],
  schema,
});
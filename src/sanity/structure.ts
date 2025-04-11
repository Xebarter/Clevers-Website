import type { StructureResolver } from 'sanity/desk'  // Updated import path

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems(),
      // You can add custom items here if needed
      // S.listItem()
      //   .title('Custom Item')
      //   .child(S.document().schemaType('customType'))
    ])
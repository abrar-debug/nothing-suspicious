import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('video').child(
        S.documentList()
          .title('Videos')
          .filter('_type == "video"')
          .defaultOrdering([{field: '_createdAt', direction: 'asc'}]),
      ),
    ])

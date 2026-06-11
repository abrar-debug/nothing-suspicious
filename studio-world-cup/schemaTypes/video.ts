import {defineType, defineField} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(200),
    }),
    defineField({
      name: 'url',
      title: 'YouTube Link',
      type: 'url',
      description:
        'Use public, embeddable videos only. Members-only or embed-disabled links will not play in the app player.',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
})

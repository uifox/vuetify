// Components

// Utilities
import { genericComponent } from '@/util'

// Types
import type { MakeSlots } from '@/util'
import type { Prop } from 'vue'
import { VTreeviewGroup } from './VTreeviewGroup'
import { VTreeviewItem } from './VTreeviewItem'
import { InternalTreeviewItem } from './VTreeview'
import { createList } from '../VList/list'

export const VTreeviewChildren = genericComponent<new <T extends InternalTreeviewItem>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    default: []
    // header: [ListGroupActivatorSlot]
    item: [T]
    // title: [ListItemTitleSlot]
    // subtitle: [ListItemSubtitleSlot]
  }>
}>()({
  name: 'VTreeviewChildren',

  props: {
    items: Array as Prop<InternalTreeviewItem[]>,
  },

  setup (props, { slots }) {
    createList()

    return () => slots.default?.() ?? props.items?.map(({ children, props: itemProps }) => {
      return children ? (
        <VTreeviewGroup
          value={ itemProps?.value }
        >
          {{
            default: () => (
              <VTreeviewChildren items={ children } v-slots={ slots } />
            ),
            activator: ({ props: activatorProps }) => slots.header
              ? slots.header({ ...itemProps, ...activatorProps })
              : <VTreeviewItem { ...itemProps } { ...activatorProps } />,
          }}
        </VTreeviewGroup>
      ) : (
        slots.item ? slots.item(itemProps) : <VTreeviewItem { ...itemProps } v-slots={ slots } />
      )
    })
  },
})

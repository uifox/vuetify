import { makeNestedProps, useNested } from '@/composables/nested/nested'
import { makeTagProps } from '@/composables/tag'
import { defineComponent, useRender } from '@/util'
import { computed, PropType } from 'vue'
import { VTreeviewChildren } from './VTreeviewChildren'
import { makeDensityProps, useDensity } from "@/composables/density";

export type TreeviewItem = {
  [key: string]: any
  // $type?: 'item' | 'subheader' | 'divider'
  $children?: (string | TreeviewItem)[]
}

export type InternalTreeviewItem = {
  // type?: 'item' | 'subheader' | 'divider'
  props?: Record<string, any>
  children?: InternalTreeviewItem[]
}

const parseItems = (items?: (string | TreeviewItem)[]): InternalTreeviewItem[] | undefined => {
  if (!items) return undefined

  return items.map(item => {
    if (typeof item === 'string') return { type: 'item', value: item, title: item }

    const { $type, $children, ...props } = item

    // if ($type === 'subheader') return { type: 'subheader', props }
    // if ($type === 'divider') return { type: 'divider', props }

    return { type: 'item', props, children: parseItems($children) }
  })
}

export const VTreeview = defineComponent({
  name: 'VTreeview',

  props: {
    items: Array as PropType<any[]>,
    ...makeNestedProps(),
    ...makeTagProps(),
    ...makeDensityProps(),
  },

  emits: {
    'update:selected': (val: string[]) => true,
    'update:opened': (val: string[]) => true,
  },

  setup (props, { slots, emit }) {
    const { open, select } = useNested(props)

    const items = computed(() => parseItems(props.items))
    const { densityClasses } = useDensity(props, 'v-list')

    useRender(() => (
      <props.tag
        class={[
          'v-treeview',
          'v-list',
          densityClasses.value,
        ]}
      >
        <VTreeviewChildren items={ items.value }>
          {{
            default: slots.default,
          }}
        </VTreeviewChildren>
      </props.tag>
    ))

    return {
      open,
      select,
    }
  }
})

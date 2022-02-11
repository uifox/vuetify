// Components
import { VExpandTransition } from '@/components/transitions'

// Composables
// import { useList } from './list'
import { makeTagProps } from '@/composables/tag'
import { emptyNested, useNestedItem, useNestedGroupActivator, VNestedSymbol } from '@/composables/nested/nested'

// Utilities
import { computed, defineComponent, provide, Ref } from 'vue'
import { genericComponent } from '@/util'

// Types
import type { MakeSlots } from '@/util'
import { InternalTreeviewItem } from './VTreeview'
import { useList } from '../VList/list'

export type ListGroupActivatorSlot = {
  props: {
    'onClick:prepend': (e: Event) => void
    prependIcon: string
    class: string
  }
}

const VTreeviewGroupActivator = defineComponent({
  name: 'VTreeviewGroupActivator',

  setup (_, { slots }) {
    useNestedGroupActivator()

    return () => slots.default?.()
  }
})


export const VTreeviewGroup = genericComponent<new <T extends InternalTreeviewItem>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    activator: [ListGroupActivatorSlot]
    default: []
  }>
}>()({
  name: 'VTreeviewGroup',

  props: {
    collapseIcon: {
      type: String,
      default: '$treeviewCollapse',
    },
    expandIcon: {
      type: String,
      default: '$treeviewExpand',
    },
    value: {
      type: null,
      default: undefined,
    },

    ...makeTagProps(),
  },

  setup (props, { slots }) {
    const { isOpen, open, id } = useNestedItem(computed(() => props.value), true)
    const list = useList()

    const activatorProps: Ref<ListGroupActivatorSlot['props']> = computed(() => ({
      'onClick:prepend': (e: Event) => open(!isOpen.value, e),
      prependIcon: isOpen.value ? props.collapseIcon : props.expandIcon,
      class: 'v-treeview-group__header',
      value: id.value,
    }))

    return () => {
      return (
        <props.tag
          class={[
            'v-list-group',
            {
              'v-list-group--prepend': false,
            },
          ]}
        >
          <VTreeviewGroupActivator>
            { slots.activator?.({ props: activatorProps.value }) }
          </VTreeviewGroupActivator>
          <div class="v-list-group__items">
            { isOpen.value && slots.default?.() }
          </div>
        </props.tag>
      )
    }
  },
})

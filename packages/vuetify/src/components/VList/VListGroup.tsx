// Components
import { VExpandTransition } from '@/components/transitions'

// Composables
import { useList } from './list'
import { makeTagProps } from '@/composables/tag'
import { emptyNested, useNestedGroup, VNestedSymbol } from '@/composables/nested/nested'

// Utilities
import { computed, defineComponent, provide, Ref } from 'vue'
import { genericComponent } from '@/util'

// Types
import type { InternalListItem } from './VList'
import type { MakeSlots } from '@/util'

export type ListGroupActivatorSlot = {
  props: {
    onClick: (e: Event) => void
    appendIcon: string
    class: string
  }
}

const VListGroupActivator = defineComponent({
  name: 'VListGroupActivator',

  setup (_, { slots }) {
    provide(VNestedSymbol, emptyNested)

    return () => slots.default?.()
  }
})

export const VListGroup = genericComponent<new <T extends InternalListItem>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    activator: [ListGroupActivatorSlot]
    default: []
  }>
}>()({
  name: 'VListGroup',

  props: {
    collapseIcon: {
      type: String,
      default: '$collapse',
    },
    expandIcon: {
      type: String,
      default: '$expand',
    },

    ...makeTagProps(),
  },

  setup (props, { slots }) {
    const { isOpen, open } = useNestedGroup()
    const list = useList()

    const onClick = (e: Event) => {
      open(!isOpen.value, e)
    }

    const activatorProps: Ref<ListGroupActivatorSlot['props']> = computed(() => ({
      onClick,
      appendIcon: isOpen.value ? props.collapseIcon : props.expandIcon,
      class: 'v-list-group__header',
    }))

    return () => {
      return (
        <props.tag
          class={[
            'v-list-group',
            {
              'v-list-group--prepend': list?.hasPrepend.value,
            },
          ]}
        >
          <VListGroupActivator>
            { slots.activator?.({ props: activatorProps.value }) }
          </VListGroupActivator>
          <VExpandTransition>
            <div class="v-list-group__items" v-show={isOpen.value}>
              { slots.default?.() }
            </div>
          </VExpandTransition>
        </props.tag>
      )
    }
  },
})

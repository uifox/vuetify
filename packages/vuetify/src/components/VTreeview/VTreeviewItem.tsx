import './VTreeviewItem.sass'

// Components
import { VBtn, VIcon, VSelectionControl } from '..'
import { VListItemBase } from '../VList/VListItemBase'

// Composables
import { useNestedItem } from '@/composables/nested/nested'
import { makeTagProps } from '@/composables/tag'
import { makeCheckboxProps, useCheckbox } from '../VCheckbox/VCheckbox'
import { makeRouterProps } from '@/composables/router'

// Utilities
import { computed, onMounted, watch } from 'vue'
import { defineComponent } from '@/util'

export const VTreeviewItem = defineComponent({
  name: 'VTreeviewItem',

  props: {
    active: Boolean,
    link: Boolean,
    title: String,
    selected: Boolean,
    collapseIcon: {
      type: String,
      default: '$treeviewCollapse',
    },
    expandIcon: {
      type: String,
      default: '$treeviewExpand',
    },
    prependIcon: String,
    ...makeTagProps(),
    ...makeCheckboxProps(),
    ...makeRouterProps(),
  },

  emits: {
    'update:selected': (value: boolean, e: MouseEvent) => true,
    'update:indeterminate': (value: boolean) => true,
    'click:prepend': (e: MouseEvent) => true,
  },

  setup (props, { slots, emit, attrs }) {
    const id = computed(() => props.value)
    const { select, isSelected, isIndeterminate, isOpen, open, isLeaf } = useNestedItem(id, false)
    const isActive = computed(() => {
      return props.active || isSelected.value
    })
    // const isClickable = computed(() => !props.disabled && (link.isClickable.value || props.link || props.value != null))

    onMounted(() => {
      // if (link.isExactActive?.value && parent.value != null) {
      //   root.open(parent.value, true)
      // }
    })

    const slotProps = computed(() => ({
      isActive: isActive.value,
      select,
      isSelected: isSelected.value,
    }))

    const { trueIcon, falseIcon, indeterminate } = useCheckbox(props)

    watch(isIndeterminate, () => {
      indeterminate.value = isIndeterminate.value
    })

    return () => {
      const hasPrepend = props.prependIcon || slots.prepend
      const hasTitle = props.title || slots.title

      return (
        <VListItemBase
          class={[
            'v-treeview-item',
            {
              'v-treeview-item--prepend': isLeaf.value,
            },
          ]}
        >
          {{
            prepend: !isLeaf.value ? () => (
              <VBtn
                variant="text"
                size="small"
                icon={ isOpen.value ? props.collapseIcon : props.expandIcon }
                onClick={ (e: MouseEvent) => open(!isOpen.value, e) }
              />
            ) : undefined,
            title: () => (
              <div class="v-treeview-item__content">
                { slots.selection ? slots.selection(slotProps.value) : (
                  <VSelectionControl
                    type="checkbox"
                    trueIcon={ trueIcon.value }
                    falseIcon={ falseIcon.value }
                    modelValue={ isSelected.value }
                    onClick={ (e: MouseEvent) => {
                      select(!isSelected.value, e)
                    } }
                    aria-checked={ indeterminate.value ? 'mixed' : undefined }
                  />
                ) }
                { hasPrepend ? (
                  <div class="v-treeview-item__prepend">
                    { slots.prepend ? slots.prepend() : props.prependIcon ? (
                      <VIcon icon={ props.prependIcon } />
                    ) : undefined }
                  </div>
                ) : undefined }
                { hasTitle ? (
                  <div class="v-treeview-item__label">
                    { slots.title ? slots.title() : props.title }
                  </div>
                ) : undefined }
              </div>
            ),
            append: slots.append,
          }}
        </VListItemBase>
      )
    }
  },
})

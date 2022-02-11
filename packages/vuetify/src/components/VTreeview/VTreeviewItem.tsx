import { useNestedItem } from "@/composables/nested/nested";
import { makeTagProps } from "@/composables/tag";
import { defineComponent } from "@/util";
import { computed, onMounted, watch } from "vue";
import { VBtn, VSelectionControl } from "..";
import { makeCheckboxProps, useCheckbox } from "../VCheckbox/VCheckbox";
import { VListItemBase } from "../VList/VListItemBase";
import { makeRouterProps, useLink } from "@/composables/router";
import { useList } from "../VList/list";
import './VTreeviewItem.sass'

export const VTreeviewItem = defineComponent({
  name: 'VTreeviewItem',

  props: {
    active: Boolean,
    link: Boolean,
    title: String,
    selected: Boolean,
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
    const { select, isSelected, root, parent, isIndeterminate, isOpen, open } = useNestedItem(id, false)
    const list = useList()
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
      // console.log(isSelected.value, isIndeterminate.value)
      // return (
      //   <props.tag
      //     class="v-treeview-item"
      //   >
      //     { props.prependIcon && (
      //       <VBtn
      //         variant="text"
      //         size="small"
      //         icon={ props.prependIcon }
      //         onClick={ (e: MouseEvent) => emit('click:prepend', e) }
      //       />
      //     ) }
      //     <VSelectionControl
      //       type="checkbox"
      //       trueIcon={ trueIcon.value }
      //       falseIcon={ falseIcon.value }
      //       modelValue={ isSelected.value }
      //       onClick={ (e: MouseEvent) => select(!isSelected.value, e) }
      //       aria-checked={ indeterminate.value ? 'mixed' : undefined }
      //     />
      //     <div>
      //       { props.title }
      //     </div>
      //   </props.tag>
      // )
      return (
        <VListItemBase
          class="v-treeview-item"
        >
          {{
            prepend: props.prependIcon ? () => (
              <VBtn
                variant="text"
                size="small"
                icon={ props.prependIcon }
                onClick={ (e: MouseEvent) => open(!isOpen.value, e) }
              />
            ) : undefined,
            title: () => (
              <div class="v-treeview-item__label">
                <VSelectionControl
                  type="checkbox"
                  trueIcon={ trueIcon.value }
                  falseIcon={ falseIcon.value }
                  modelValue={ isSelected.value }
                  onClick={ (e: MouseEvent) => {
                    console.log('select')
                    select(!isSelected.value, e)
                  } }
                  aria-checked={ indeterminate.value ? 'mixed' : undefined }
                />
                <div>
                  { props.title }
                </div>
              </div>
            ),
          }}
        </VListItemBase>
      )
    }
  }
})

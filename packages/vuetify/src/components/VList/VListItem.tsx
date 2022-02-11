// Styles
import './VListItem.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VListItemAvatar } from './VListItemAvatar'
import { VListItemHeader } from './VListItemHeader'
import { VListItemSubtitle } from './VListItemSubtitle'
import { VListItemTitle } from './VListItemTitle'

// Composables
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeRouterProps, useLink } from '@/composables/router'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useList } from './list'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { computed, onMounted } from 'vue'
import { genericComponent } from '@/util'
import { useNestedItem } from '@/composables/nested/nested'

// Types
import type { MakeSlots } from '@/util'
import { VListItemBase } from './VListItemBase'

type ListItemSlot = {
  isActive: boolean
  activate: (value: boolean) => void
  isSelected: boolean
  select: (value: boolean) => void
}

export type ListItemTitleSlot = {
  title?: string
}

export type ListItemSubtitleSlot = {
  subtitle?: string
}

export const VListItem = genericComponent<new () => {
  $slots: MakeSlots<{
    prepend: [ListItemSlot]
    append: [ListItemSlot]
    default: [ListItemSlot]
    title: [ListItemTitleSlot]
    subtitle: [ListItemSubtitleSlot]
  }>
}>()({
  name: 'VListItem',

  directives: { Ripple },

  props: {
    active: Boolean,
    activeColor: String,
    activeClass: String,
    appendAvatar: String,
    appendIcon: String,
    disabled: Boolean,
    link: Boolean,
    prependAvatar: String,
    prependIcon: String,
    subtitle: String,
    title: String,
    value: null,

    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeVariantProps({ variant: 'text' } as const),
  },

  setup (props, { attrs, slots }) {
    const link = useLink(props, attrs)
    const id = computed(() => props.value ?? link.href.value)
    const { select, isSelected, root, parent } = useNestedItem(id, false)
    const list = useList()
    const isActive = computed(() => {
      return props.active || link.isExactActive?.value || isSelected.value
    })
    const isClickable = computed(() => !props.disabled && (link.isClickable.value || props.link || props.value != null))

    onMounted(() => {
      if (link.isExactActive?.value && parent.value != null) {
        root.open(parent.value, true)
      }
    })

    const slotProps = computed(() => ({
      isActive: isActive.value,
      select,
      isSelected: isSelected.value,
    }))

    return () => {
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon)
      list?.updateHasPrepend(hasPrepend)

      return (
        <VListItemBase
          { ...props }
          active={ isActive.value }
          href={ link.href.value }
          link={ isClickable.value }
          onClick={ isClickable && ((e: MouseEvent) => {
            link.navigate?.(e)
            select(!isSelected.value, e)
          })}
        >
          {{
            ...slots,
            default: () => slots.default?.(slotProps),
          }}
        </VListItemBase>
      )
    }
  },
})

export type VListItem = InstanceType<typeof VListItem>

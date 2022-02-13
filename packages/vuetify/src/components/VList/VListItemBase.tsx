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
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { computed } from 'vue'
import { genericComponent } from '@/util'

// Types
import type { MakeSlots } from '@/util'

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

export const VListItemBase = genericComponent<new () => {
  $slots: MakeSlots<{
    prepend: [ListItemSlot]
    append: [ListItemSlot]
    default: [ListItemSlot]
    title: [ListItemTitleSlot]
    subtitle: [ListItemSubtitleSlot]
  }>
}>()({
  name: 'VListItemBase',

  directives: { Ripple },

  props: {
    active: Boolean,
    activeColor: String,
    activeClass: String,
    appendAvatar: String,
    appendIcon: String,
    disabled: Boolean,
    href: String,
    link: Boolean,
    prependAvatar: String,
    prependIcon: String,
    subtitle: String,
    title: String,
    value: null,
    selectOnClick: {
      type: Boolean,
      default: true,
    },

    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    // ...makeRouterProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeVariantProps({ variant: 'text' } as const),
  },

  setup (props, { attrs, slots }) {
    // const link = useLink(props, attrs)
    // const id = computed(() => props.value ?? link.href.value)
    // const { select, isSelected, root, parent } = useNestedItem(id)
    // const list = useList()
    // const isActive = computed(() => {
    //   return props.active || link.isExactActive?.value || isSelected.value
    // })
    const variantProps = computed(() => {
      const activeColor = props.activeColor ?? props.color
      return {
        // color: isActive.value ? activeColor : props.color,
        color: props.active ? activeColor : props.color,
        textColor: props.textColor,
        variant: props.variant,
      }
    })

    // onMounted(() => {
    //   if (link.isExactActive?.value && parent.value != null) {
    //     root.open(parent.value, true)
    //   }
    // })

    const { themeClasses } = provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { colorClasses, colorStyles, variantClasses } = useVariant(variantProps)
    const { densityClasses } = useDensity(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { roundedClasses } = useRounded(props)

    const slotProps = computed(() => ({
      // isActive: isActive.value,
      // select,
      // isSelected: isSelected.value,
      isActive: props.active,

    }))

    return () => {
      // const Tag = (link.isLink.value) ? 'a' : props.tag
      const hasTitle = (slots.title || props.title)
      const hasSubtitle = (slots.subtitle || props.subtitle)
      const hasHeader = !!(hasTitle || hasSubtitle)
      const hasAppend = !!(slots.append || props.appendAvatar || props.appendIcon)
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon)
      // const isClickable = !props.disabled && (link.isClickable.value || props.link || props.value != null)

      // list?.updateHasPrepend(hasPrepend)

      return (
        <props.tag
          class={[
            'v-list-item',
            {
              // 'v-list-item--active': isActive.value,
              'v-list-item--active': props.active,
              'v-list-item--disabled': props.disabled,
              // 'v-list-item--link': isClickable,
              'v-list-item--link': props.link,
              // 'v-list-item--prepend': !hasPrepend && list?.hasPrepend.value,
              // [`${props.activeClass}`]: isActive.value && props.activeClass,
              [`${props.activeClass}`]: props.active && props.activeClass,
            },
            themeClasses.value,
            borderClasses.value,
            colorClasses.value,
            densityClasses.value,
            elevationClasses.value,
            roundedClasses.value,
            variantClasses.value,
          ]}
          style={[
            colorStyles.value,
            dimensionStyles.value,
          ]}
          // href={ link.href.value }
          href={ props.href }
          // tabindex={ isClickable ? 0 : undefined }
          tabindex={ props.link ? 0 : undefined }
          // onClick={ isClickable && ((e: MouseEvent) => {
          //   link.navigate?.(e)
          //   props.selectOnClick && select(!isSelected.value, e)
          // })}
          // v-ripple={ isClickable }
          v-ripple={ props.link }
        >
          {/* { genOverlays(isClickable || isActive.value, 'v-list-item') } */}
          { genOverlays(props.link || props.active, 'v-list-item') }

          { hasPrepend && (
            slots.prepend
              ? slots.prepend(slotProps.value)
              : (
                <VListItemAvatar left>
                  <VAvatar
                    density={ props.density }
                    icon={ props.prependIcon }
                    image={ props.prependAvatar }
                  />
                </VListItemAvatar>
              )
          ) }

          { hasHeader && (
            <VListItemHeader>
              { hasTitle && (
                <VListItemTitle>
                  { slots.title
                    ? slots.title({ title: props.title })
                    : props.title
                  }
                </VListItemTitle>
              ) }

              { hasSubtitle && (
                <VListItemSubtitle>
                  { slots.subtitle
                    ? slots.subtitle({ subtitle: props.subtitle })
                    : props.subtitle
                  }
                </VListItemSubtitle>
              ) }
            </VListItemHeader>
          ) }

          { slots.default?.(slotProps.value) }

          { hasAppend && (
            slots.append
              ? slots.append(slotProps.value)
              : (
                <VListItemAvatar right>
                  <VAvatar
                    density={ props.density }
                    icon={ props.appendIcon }
                    image={ props.appendAvatar }
                  />
                </VListItemAvatar>
              )
          ) }
        </props.tag>
      )
    }
  },
})

export type VListItem = InstanceType<typeof VListItemBase>

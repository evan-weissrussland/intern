import { type ComponentPropsWithoutRef, type ReactNode, useEffect, useState } from 'react'

import * as ScrollArea from '@radix-ui/react-scroll-area'
import clsx from 'clsx'

import s from './scroll.module.scss'
type VariantRootType = 'always' | 'auto' | 'hover' | 'scroll'
export type ScrollProps = {
  children?: ReactNode
  height?: string
  noScrollTumbs?: boolean
  padding?: string
  variant?: VariantRootType
  width?: string
} & ComponentPropsWithoutRef<typeof ScrollArea.Root>

export const Scroll = ({
  children,
  className,
  height,
  noScrollTumbs,
  padding = '0px',
  variant = 'hover',
  width,
}: ScrollProps) => {
  /**
   * Стиль для скрытия полос прокруток при мобильной версии
   */
  const style = noScrollTumbs && s.mobile

  return (
    <>
      <ScrollArea.Root
        className={clsx(s.root, className)}
        scrollHideDelay={100}
        style={{ height, padding, width }}
        type={variant}
      >
        <ScrollArea.Viewport className={clsx(s.viewport, style)}>{children}</ScrollArea.Viewport>

        <ScrollArea.Scrollbar className={clsx(s.horizontal, style)} orientation={'horizontal'}>
          {!noScrollTumbs && <ScrollArea.Thumb className={s.thumb2} />}
        </ScrollArea.Scrollbar>
        <>
          <ScrollArea.Scrollbar className={clsx(s.vertical, style)} orientation={'vertical'}>
            {!noScrollTumbs && <ScrollArea.Thumb className={s.thumb1} />}
          </ScrollArea.Scrollbar>

          {!noScrollTumbs && <ScrollArea.Corner />}
        </>
      </ScrollArea.Root>
    </>
  )
}

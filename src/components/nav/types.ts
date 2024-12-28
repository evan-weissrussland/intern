import { ReactNode } from 'react'

export type PropsLink = {
  hiddenInMobile?: true
  icon: ReactNode
  isButton?: boolean
  name: string
  path: string
}

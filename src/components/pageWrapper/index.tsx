import { PropsWithChildren } from 'react'
type CustomProps = {
  className?: string
}
export const PageWrapper = (props: PropsWithChildren<CustomProps>) => {
  // const { children } = props

  return (
    <>
      <div {...props} style={{ height: '100%' }} />
    </>
  )
}

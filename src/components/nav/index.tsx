import { Bookmark, Create, Home, LogOut, Message, Person, Search, TrendingUp } from '@/assets/icons'
import { PropsLink } from '@/components/nav/types'
import { useLogoutMutation } from '@/services/inctagram.auth.service'
import { useGetMySubscriptionsQuery } from '@/services/inctagram.subscriptions.service'
import { Button, Typography } from '@chrizzo/ui-kit'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

import s from './nav.module.scss'

const links: PropsLink[] = [
  {
    icon: <Home />,
    name: 'Home',
    path: '/',
  },
  {
    icon: <Create />,
    isButton: true,
    name: 'Create',
    path: '/create',
  },
  {
    icon: <Person />,
    name: 'My Profile',
    path: '/profile',
  },
  {
    icon: <Message />,
    name: 'Messenger',
    path: '/messenger',
  },
  {
    icon: <Search />,
    name: 'Search',
    path: '/search',
  },
  {
    icon: <TrendingUp />,
    name: 'Statistics',
    path: '/statistics',
  },
  {
    icon: <Bookmark />,
    name: 'Favorites',
    path: '/favorites',
  },
  {
    icon: <LogOut />,
    isButton: true,
    name: 'Log Out',
    path: '/logout',
  },
]

type Props = {
  isSpecialAccount: boolean
  myProfileId: number | undefined
}

export const Nav = ({ isSpecialAccount, myProfileId }: Props) => {
  const router = useRouter()
  /**
   * запрос за проверкой подписки (для отображения вкладки статистики)
   */
  const { data } = useGetMySubscriptionsQuery()

  /**
   * вылогинивание
   */
  const [logout, { isLoading }] = useLogoutMutation()

  const handleClick = (isButton?: boolean, linkName?: string) => {
    if (isButton && linkName === 'Log Out') {
      logout()
        .unwrap()
        .then(() => {
          void router.push('/login')
        })
    }
  }

  return (
    <nav className={s.navWrapper}>
      <ul className={s.navList}>
        {links.map((link, index) => {
          const isStatisticsLink = link.name === 'Statistics'
          const shouldHide = isStatisticsLink && !isSpecialAccount
          const activeLink =
            ((router.pathname.includes(link.path.slice(1)) && link.path.slice(1).length > 0) ||
              (!router.pathname.slice(1).length && link.name === 'Home')) &&
            Number(router.query.id) === myProfileId
          const hiddenStaticticsStyle = link.name === 'Statistics' && !data?.length

          return (
            <li
              className={clsx(
                s.navItem,
                s[`navItem${index + 1}`],
                shouldHide && s.hidden,
                hiddenStaticticsStyle && s.hidden
              )}
              key={index}
            >
              <Button
                as={link.isButton ? 'button' : Link}
                className={clsx(s.wrapper, activeLink && s.activeLink)}
                disabled={isLoading}
                href={link.path}
                onClick={() => handleClick(link.isButton, link.name)}
                variant={'text'}
              >
                {link.icon}
                <Typography as={'span'} variant={'regularMedium14'}>
                  {link.name}
                </Typography>
              </Button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

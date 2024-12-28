import { useEffect, useState } from 'react'

export const useWindowWidth = () => {
  /**
   * стейт контроля ширины окна
   */
  const [windowWidth, setWindowWidth] = useState(0)

  /**
   * контроль за шириной окна. Массив зависимостей должен быть пустым, иначе
   * после каждого set'а будем вешать слушателей.
   */
  useEffect(() => {
    if (!windowWidth) {
      setWindowWidth(window.innerWidth)
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowWidth
}

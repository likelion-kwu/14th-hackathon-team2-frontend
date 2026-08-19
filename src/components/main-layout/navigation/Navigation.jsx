import './Navigation.css'
import { Icon } from '../../icon/Icon'
import { useLocation, useNavigate } from 'react-router-dom'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    {
      path: '/home',
      activeIcon: 'navigation-home-active',
      disabledIcon: 'navigation-home-disabled',
    },
    {
      path: '/reflection',
      activeIcon: 'navigation-reflec-active',
      disabledIcon: 'navigation-reflec-disabled',
    },
    {
      path: '/routine',
      activeIcon: 'navigation-routine-active',
      disabledIcon: 'navigation-routine-disabled',
    },
    {
      path: '/ranking',
      activeIcon: 'navigation-rank-active',
      disabledIcon: 'navigation-rank-disabled',
    },
    {
      path: '/customize',
      activePaths: ['/customize', '/setting'],
      activeIcon: 'navigation-custom-active',
      disabledIcon: 'navigation-custom-disabled',
    },
  ]

  return (
    <div className='navigation__page'>
      <nav className='navigation__container'>
        {navigationItems.map((item) => {
          const isActive = item.activePaths
            ? item.activePaths.includes(location.pathname)
            : location.pathname === item.path

          return (
            <button
              key={item.path}
              type='button'
              className='navigation__button'
              onClick={() => navigate(item.path)}
            >
              <Icon name={isActive ? item.activeIcon : item.disabledIcon} width={24} height={24} />
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Navigation

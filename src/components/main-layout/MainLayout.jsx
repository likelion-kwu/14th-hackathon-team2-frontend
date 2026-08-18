import './MainLayout.css'
import { Outlet } from 'react-router-dom'
import Navigation from './navigation/Navigation'

const MainLayout = () => {
  return (
    <div className='mainlayout__container'>
      <div className='mainlayout__page'>
        <Outlet />
        <Navigation className='navigation' />
      </div>
    </div>
  )
}

export default MainLayout

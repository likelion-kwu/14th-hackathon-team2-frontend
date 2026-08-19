import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Navigation from './navigation/Navigation'
import RoutinePlusPage from '../../pages/routineplus-page/RoutinePlusPage'

import './MainLayout.css'

const MainLayout = () => {
  const [isRoutinePlusOpen, setIsRoutinePlusOpen] = useState(false)

  const handleRoutinePlusToggle = () => {
    setIsRoutinePlusOpen((prev) => !prev)
  }

  const handleRoutinePlusClose = () => {
    setIsRoutinePlusOpen(false)
  }

  return (
    <div className='mainlayout__container'>
      <div className='mainlayout__page'>
        <Outlet />

        {isRoutinePlusOpen && <RoutinePlusPage onClose={handleRoutinePlusClose} />}
        <Navigation
          isRoutinePlusOpen={isRoutinePlusOpen}
          onRoutinePlusClick={handleRoutinePlusToggle}
          onNavigate={handleRoutinePlusClose}
        />
      </div>
    </div>
  )
}

export default MainLayout

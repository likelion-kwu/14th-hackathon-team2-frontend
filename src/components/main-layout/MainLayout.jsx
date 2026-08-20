import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import RoutinePlusPage from '../../pages/routineplus-page/RoutinePlusPage'
import Navigation from './navigation/Navigation'

import './MainLayout.css'

const MainLayout = () => {
  const [isRoutinePlusOpen, setIsRoutinePlusOpen] = useState(false)
  const [initialRoutine, setInitialRoutine] = useState(null)
  const [homeRefreshKey, setHomeRefreshKey] = useState(0)

  const handleRoutinePlusOpen = (routine = null) => {
    setInitialRoutine(routine)
    setIsRoutinePlusOpen(true)
  }

  const handleRoutinePlusClose = () => {
    setIsRoutinePlusOpen(false)
    setInitialRoutine(null)
  }

  const handleRoutinePlusToggle = () => {
    if (isRoutinePlusOpen) {
      handleRoutinePlusClose()
      return
    }

    handleRoutinePlusOpen()
  }

  const handleRoutineCreated = () => {
    setHomeRefreshKey((currentKey) => currentKey + 1)
  }

  return (
    <div className='mainlayout__container'>
      <div className='mainlayout__page'>
        <Outlet
          context={{
            openRoutinePlus: handleRoutinePlusOpen,
            isRoutinePlusOpen,
            homeRefreshKey,
          }}
        />

        {isRoutinePlusOpen && (
          <RoutinePlusPage
            initialRoutine={initialRoutine}
            onClose={handleRoutinePlusClose}
            onCreated={handleRoutineCreated}
          />
        )}

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

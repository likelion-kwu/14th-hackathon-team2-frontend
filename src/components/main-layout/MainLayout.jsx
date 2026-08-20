import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import RoutinePlusPage from '../../pages/routineplus-page/RoutinePlusPage'
import Navigation from './navigation/Navigation'

import './MainLayout.css'

const MainLayout = () => {
  const [isRoutinePlusOpen, setIsRoutinePlusOpen] = useState(false)
  const [initialRoutine, setInitialRoutine] = useState(null)
  const [homeRefreshKey, setHomeRefreshKey] = useState(0)

  const [deletedRoutineIds, setDeletedRoutineIds] = useState(() => {
    try {
      const savedRoutineIds = window.sessionStorage.getItem('filaby-deleted-routine-ids')

      const parsedRoutineIds = savedRoutineIds ? JSON.parse(savedRoutineIds) : []

      return Array.isArray(parsedRoutineIds) ? parsedRoutineIds : []
    } catch {
      return []
    }
  })

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

  const handleRoutineDeleted = (routineId) => {
    setDeletedRoutineIds((currentIds) => {
      if (currentIds.includes(routineId)) {
        return currentIds
      }

      const nextIds = [...currentIds, routineId]

      try {
        window.sessionStorage.setItem('filaby-deleted-routine-ids', JSON.stringify(nextIds))
      } catch (error) {
        console.error('삭제한 루틴 정보를 저장하지 못했습니다.', error)
      }

      return nextIds
    })

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
            deletedRoutineIds,
          }}
        />

        {isRoutinePlusOpen && (
          <RoutinePlusPage
            initialRoutine={initialRoutine}
            onClose={handleRoutinePlusClose}
            onCreated={handleRoutineCreated}
            onDeleted={handleRoutineDeleted}
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

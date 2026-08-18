import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/main-layout/MainLayout'
import ReflectionPage from '../pages/reflection-page/entry/ReflectionPage'
import RankingPage from '../pages/ranking-page/entry/RankingPage'
import CustomizePage from '../pages/customize-page/entry/CustomizePage'

export const AppRouter = createBrowserRouter([
  {
    path: '/onboarding',
    element: <div>onboarding</div>,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'reflection', element: <ReflectionPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'customize', element: <CustomizePage /> },
    ],
  },
])

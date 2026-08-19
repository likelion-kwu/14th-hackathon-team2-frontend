import { createBrowserRouter } from 'react-router-dom'
import OnboardingPage from '../pages/onboarding-page/OnboardingPage'
import InputInforPage from '../pages/inputinfor-page/InputInforPage'
import TrackSettingPage from '../pages/tracksetting-page/TrackSettingPage'
import AvatarSettingPage from '../pages/avatarset-page/AvatarSettingPage'
import StoryPage from '../pages/story-page/StoryPage'

import MainLayout from '../components/main-layout/MainLayout'
import ReflectionPage from '../pages/reflection-page/entry/ReflectionPage'
import RankingPage from '../pages/ranking-page/entry/RankingPage'
import CustomizePage from '../pages/customize-page/entry/CustomizePage'
import HomePage from '../pages/home-page/entry/HomePage'
import SettingPage from '../pages/setting-page/entry/SettingPage'

export const AppRouter = createBrowserRouter([
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/inputinfor',
    element: <InputInforPage />,
  },
  {
    path: '/tracksetting',
    element: <TrackSettingPage />,
  },
  {
    path: '/avatarsetting',
    element: <AvatarSettingPage />,
  },
  {
    path: '/story',
    element: <StoryPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'reflection', element: <ReflectionPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'customize', element: <CustomizePage /> },
      { path: 'setting', element: <SettingPage /> },
    ],
  },
  { path: '*', element: <div>404 Not Found</div> },
])

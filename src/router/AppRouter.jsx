import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../components/main-layout/MainLayout'

import AvatarSettingPage from '../pages/avatarset-page/AvatarSettingPage'
import CustomizePage from '../pages/customize-page/entry/CustomizePage'
import HomePage from '../pages/home-page/entry/HomePage'
import InputInforPage from '../pages/inputinfor-page/InputInforPage'
import OnboardingPage from '../pages/onboarding-page/OnboardingPage'
import RankingPage from '../pages/ranking-page/entry/RankingPage'
import ReflectionPage from '../pages/reflection-page/entry/ReflectionPage'
import SettingPage from '../pages/setting-page/entry/SettingPage'
import StoryPage from '../pages/story-page/StoryPage'
import TrackSettingPage from '../pages/tracksetting-page/TrackSettingPage'
import VerificationPage from '../pages/verification-page/VerificationPage'

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <OnboardingPage />,
  },
  { path: '/onboarding', element: <OnboardingPage /> },
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
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'verification',
        element: <VerificationPage />,
      },
      {
        path: 'reflection',
        element: <ReflectionPage />,
      },
      {
        path: 'routine',
        element: <div>routine</div>,
      },
      {
        path: 'ranking',
        element: <RankingPage />,
      },
      {
        path: 'customize',
        element: <CustomizePage />,
      },
      {
        path: 'setting',
        element: <SettingPage />,
      },
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
])

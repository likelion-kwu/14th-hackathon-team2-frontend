import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppRouter } from './router/AppRouter'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <RouterProvider router={AppRouter} />

      <Toaster
        position='bottom-center'
        containerStyle={{
          bottom: '100px',
        }}
        toastOptions={{
          style: {
            padding: '14px 20px',
            borderRadius: '100px',
            backgroundColor: 'rgba(45, 48, 52, 0.9)',
            color: '#ffffff',
            fontFamily: 'inherit',
            fontSize: '14px',
          },
          loading: {
            duration: Infinity,
          },
          success: {
            duration: 2000,
            style: {
              backgroundColor: '#72c96b',
            },
          },
          error: {
            duration: 2500,
            style: {
              backgroundColor: '#e56868',
            },
          },
        }}
      />
    </div>
  )
}

export default App

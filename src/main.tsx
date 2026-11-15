import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigator } from './app/Navigator'
import { AppProvider } from './app/store'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <main className="app-page">
        <Navigator />
      </main>
    </AppProvider>
  </StrictMode>,
)

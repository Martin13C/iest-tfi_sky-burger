import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify'

import { AuthProvider } from './context/AuthContext'
import { CarritoProvider } from './context/CarritoContext'

import App from './App'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CarritoProvider>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
            newestOnTop
          />
        </CarritoProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
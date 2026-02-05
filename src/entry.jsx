import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import './index.css'

const themeConfig = {
  token: {
    colorPrimary: '#D32F2F',
    colorSuccess: '#4CAF50',
    colorWarning: '#FFB300',
    fontFamily: 'Poppins, sans-serif',
    borderRadius: 8,
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)

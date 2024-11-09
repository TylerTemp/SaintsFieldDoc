import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import ErrorBoundary from '~/Components/ErrorBoundary'
import ThemeProvider from '~/Components/Theme/ThemeProvider'
import Layout from './Components/Layout'
import NotFound from './Pages/NotFound'
// import { ToastContainer } from 'react-toastify';


import '@fontsource/roboto/300.css'

import { CssBaseline } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<>
    <ThemeProvider>
        <CssBaseline />
        <ErrorBoundary>
            
            <p>Hi</p>
            {/* <ToastContainer /> */}
            <Router>
                <HelmetProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </HelmetProvider>
            </Router>
        </ErrorBoundary>
     </ThemeProvider>
</>);


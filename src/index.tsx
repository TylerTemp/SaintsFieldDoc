import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import ErrorBoundary from '~/Components/ErrorBoundary'
import ThemeProvider from '~/Components/Theme/ThemeProvider'
import ToastContainer from '~/Components/ToastContainer'
import Layout from './Components/Layout'
import Section from './Pages/Section'
import Search from './Pages/Search'
// import NotFound from './Pages/NotFound'
// import { ToastContainer } from 'react-toastify';


import '@fontsource/roboto/300.css'

import { CssBaseline } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<>
    <ThemeProvider>
        <CssBaseline />
        <ErrorBoundary>
            <ToastContainer />
            <Router>
                <HelmetProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Section />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="*" element={<Section />} />
                        </Route>
                    </Routes>
                </HelmetProvider>
            </Router>
        </ErrorBoundary>
    </ThemeProvider>
</>);


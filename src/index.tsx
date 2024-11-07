import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// import ErrorBoundary from '~/Components/ErrorBoundary'
// import ThemeProvider from '~/Components/Theme/ThemeProvider'
// import { ToastContainer } from 'react-toastify';


import '@fontsource/roboto/300.css'

import { CssBaseline } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<>
    {/* <ThemeProvider> */}
        <CssBaseline />
        {/* <ErrorBoundary>
            <ToastContainer /> */}
            <p>Hi</p>
            <Router>
                <HelmetProvider>
                    {/* <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="video/:diskId/*" element={<IndexedVideo mountType={MountType.Root} />} />

                            <Route path="unindexed" element={<UnindexedList />}>
                                <Route path=":diskId/*" element={<FixedDim><UnindexedVideo /></FixedDim>} />
                            </Route>

                            <Route path="model" element={<ModelList />}>
                                <Route path=":modelId" element={<FixedDim><Model /></FixedDim>}>
                                    <Route path="video/:diskId/*" element={<FixedDim zIndexOffset={1}><IndexedVideo mountType={MountType.Model} /></FixedDim>} />
                                </Route>
                            </Route>

                            <Route path="company/:companyName" element={<Company />}>
                                <Route path="video/:diskId/*" element={<FixedDim><IndexedVideo mountType={MountType.Company}/></FixedDim>} />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes> */}
                </HelmetProvider>
            </Router>
        {/* </ErrorBoundary> */}
     {/* </ThemeProvider> */}
</>);


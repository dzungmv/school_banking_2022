import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import GlobalStyles from '@/components/GlobalStyles';
import reportWebVitals from './reportWebVitals';
import { StyledEngineProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from '@/_redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import 'nprogress/nprogress.css';

import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
const persistor = persistStore(store);

root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Router>
                <GlobalStyles>
                    <StyledEngineProvider injectFirst>
                        <App />
                    </StyledEngineProvider>
                </GlobalStyles>
            </Router>
        </PersistGate>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

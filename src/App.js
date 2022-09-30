import React from 'react';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import history from './services/history';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';

import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { persistor } from './store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Header />
          <Routes />
          <GlobalStyles />
          <ToastContainer autoClose={3000} className="toast-container" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

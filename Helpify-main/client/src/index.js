import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <AuthProvider>
          <OrdersProvider>
            <App />
          </OrdersProvider>
        </AuthProvider>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>
);

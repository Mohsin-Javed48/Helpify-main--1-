import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import { ServicesProvider } from './context/ServicesContext.jsx';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ServicesProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </ServicesProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

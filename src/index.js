import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// Enable PWA bằng cách register service worker
// Đăng ký service worker với xử lý cập nhật
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('Service Worker registered:', registration.scope);
  },
  onUpdate: (registration) => {
    // Hiển thị thông báo và reload
    if (window.confirm('A new version is available. Reload now?')) {
      // Unregister service worker cũ và reload
      registration.unregister().then(() => {
        window.location.reload();
      });
    }
  },
});

reportWebVitals();

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import en from './locales/en';
import app from './app.js';

i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en,
  },
}).then(app);
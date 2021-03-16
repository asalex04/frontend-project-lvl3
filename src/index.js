import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import en from './locales/en';
import app from './app.js';

const i18Instance = i18next.createInstance();
i18Instance.init({
  lng: 'en',
  debug: true,
  resources: {
    en,
  },
}).then(app(i18Instance));
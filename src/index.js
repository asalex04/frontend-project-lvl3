import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import en from './locales/en';
import app from './app.js';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  }).then(app); 
}

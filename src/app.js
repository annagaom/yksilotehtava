import express from 'express';
import api from './api/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1', api);


app.get('/', (req, res) => {
  const user = {
    asiakas_etunimi: 'Anni',
    asiakas_sukunimi: 'Ansku',
    asiakas_tunnus: 'anni',
    asiakas_salasana: 12345,
    asiakas_email: 'anni@ascafe.fi',
    asiakas_puh: 1234567,
    asiakas_registeri_pvm: '13-07-2015'

  };
  res.json(user);
});

export default app;

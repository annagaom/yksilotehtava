import express from 'express';
import api from './api/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1', api);

app.use((req, res) => {
  res.status(404).json({ error: 'Reittiä ei löydy' });
});

app.use((err, req, res, next) => {
  console.error('Virhe:', err.message);
  res.status(500).json({ error: 'Jotain meni pieleen' });
});


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

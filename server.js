const express = require('express');
const knex = require('knex')

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'peko',
      database : 'worldcup'
    }
  });


app.put('/load', (req, res) => {
    const { worldcupName } = req.body;
    db('worldcups')
        .select('*')
        .then(result => {
            res.json(result)
        })
})


app.put('/worldcups', (req, res) => {

    const { worldcupName } = req.body;
    db('worldcups').where('worldcupname', '=', worldcupName)
        .select('noc', 'thumbnail')
        .then(result => {
            res.json(result[0])
        })
})

app.put('/candidates', (req, res) => {

    const { worldcupName } = req.body;
    db('candidates').where('worldcupname', '=', worldcupName)
        .select('*')
        .then(result => {
            res.json(result)
        })
})

app.listen(3001, () => {
    console.log('server is running at 3001')
})
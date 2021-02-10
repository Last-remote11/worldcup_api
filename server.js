const express = require('express');
const knex = require('knex')

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl : true
    }
  });

app.get('/', (req, res) => {
    res.send('it is working')
})

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
        .catch(err => res.status(400).json('candidate를 불러오는 중 에러'))
})


app.put('/rank', (req, res) => {

    const { worldcupName } = req.body;
    db('candidates').where('worldcupname', '=', worldcupName)
    .select('name','wincount', 'img')
    .orderBy('wincount', 'desc')
    .then(result => {
        res.json(result)
    })
    .catch(err => res.status(400).json('rank를 불러오는 중 에러'))
})


app.post('/addWorldcupName', (req, res) => {

    const { addWorldcupName, addThumbnail, addNumberOfCandidates } = req.body;
    db('worldcups').insert({worldcupname: addWorldcupName, thumbnail: addThumbnail, noc: addNumberOfCandidates })
        .returning('worldcupname')
        .then(result => res.json(result))
        .catch(err => res.status(400).json(err, 'worldcup 테이블에 추가하는 중 오류'))
});

app.post('/addCandidates', (req, res) => {

    db('candidates').insert(req.body)
        .returning('*')
        .then(result => res.json(result))
        .catch(err => res.status(400).json(err, 'candidates 테이블에 추가하는 중 오류'))
});


app.post('/addWinner', (req, res) => {

    const { winner, worldcupname } = req.body
    db('candidates').where({
        name: winner,
        worldcupname: worldcupname
    })
    .increment('wincount', 1)
    .returning('wincount')
    .then(wincount => {
        res.json(wincount[0])
    })
    .catch(err => res.status(400).json("에러발생"))
})

app.post('/signIn', (req, res) => {

    const { email, password } = req.body
    if (email === 'peko@miko' && password === 'mikopeko') {
        res.send('loginSuccess')
    }
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running at ${process.env.PORT}`)
});
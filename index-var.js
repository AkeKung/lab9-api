const express = require('express')
const uuid = require('uuid')
const bodyParser = require('body-parser')

const transactions = require('./data/data.json')

const app = express()

// middleware section
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))

app.get('/api/v1/:uid/transactions', (req,res,next) => {
  res.json({ uid: req.params.uid,
             transactions: transactions})
})

app.put('/api/v1/transactions/:id', (req,res) => {
  const update_index = transactions.findIndex( t => t.id == req.params.id )
  if (update_index !== 1) {
    const t = {
      name: req.body.name,
      amount: Number(req.body.amount),
      updated: new Date()
    }
    res.status(200).json( Object.assign( transactions[update_index], t) ) 
  } else {
    res.status(404).json( { error: 'transaction not found' } )
  }
})

app.delete('/api/v1/transactions/:id', (req,res) => {
  const delete_index = transactions.findIndex( t => t.id == req.params.id )
  if (delete_index !== -1) {
    transactions.splice(delete_index,1)
    res.status(200).json({ message: 'delete successful!'})
  } else {
    res.status(404).json({ error: 'transaction not found!'})
  }
})

app.get('/api/v1/transactions/:id', (req,res,next) => {
  const t = transactions.find( t => t.id == req.params.id )
  if (!t) {
    res.status(404).json({ error:'transaction not found'})
  }
  res.status(200).json(t)
})

app.post('/api/v1/transactions', (req,res) => {
  const name = req.body.name
  const amount = req.body.amount

  const date = new Date()
  const t = {
    id: uuid.v4(),
    name: name,
    amount: Number(amount),
    created: date,
    updated: date
  }

  transactions.unshift(t)
  res.status(200).json(t)

})
app.listen(3000, () => {
  console.log('Server is listening at port: 3000')
})

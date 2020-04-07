const uuid = require('uuid')
const express = require('express')

const router = express.Router()

const transactions = require('../data/data.json')

router.get('/api/v1/transactions', (req,res,next) => {
  res.json(transactions)
})

router.put('/api/v1/transactions/:id', (req,res) => {
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

router.delete('/api/v1/transactions/:id', (req,res) => {
  const delete_index = transactions.findIndex( t => t.id == req.params.id )
  if (delete_index !== -1) {
    transactions.splice(delete_index,1)
    res.status(200).json({ message: 'delete successful!'})
  } else {
    res.status(404).json({ error: 'transaction not found!'})
  }
})

router.get('/api/v1/transactions/:id', (req,res,next) => {
  const t = transactions.find( t => t.id == req.params.id )
  if (!t) {
    res.status(404).json({ error:'transaction not found'})
  }
  res.status(200).json(t)
})

router.post('/api/v1/transactions', (req,res) => {
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

module.exports = router
const express = require('express')
const router = express.Router()

const Transaction = require('../models/transactionModel')

// MongoDB Atlas connection setting
const mongoose = require('mongoose')
const connStr = process.env.DATABASE_URL
                      .replace('<password>',process.env.DATABASE_PWD)
                      .replace('<database>',process.env.DATABASE_NAME)

mongoose.connect(connStr, { useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false,
                            useCreateIndex: true })

const db = mongoose.connection
db.on('error', () => console.log('Database connection error'))
db.once('open', () => console.log('Database connected'))

router.get('/transactions', async (req,res,next) => {
  try {
    const transactions = await Transaction.find()
    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json( {error: error.message})
  }
})

router.get('/transactions/:id', async (req,res,next) => {
  try {
    const t = await Transaction.findById(req.params.id)
    if (!t) {
      res.status(404).json({ error:'transaction not found'})
    }
    res.status(200).json(t)
  } catch (error) {
    res.status(500).json( { error: 'GET::'+error.message})  
  }
})

router.post('/transactions', async (req,res) => {
  const t = new Transaction(req.body) // { name: 'something', amount: 1000 }

  try {
    await t.save()
    res.status(200).json(t)
  } catch (error) {
    res.status(500).json( { error: error.message})
  }
})

router.put('/transactions/:id', async (req,res) => {
  const update_t = {
    name: req.body.name,
    amount: Number(req.body.amount),
    updated: new Date()
  }
  try {
    const t = await Transaction.findByIdAndUpdate(req.params.id, update_t, { new: true })
    if (!t) {
      res.status(404).json( { error: 'UPDATE::transaction not found'} )
    } else {
      res.status(200).json(t)
    }
  } catch (error) {
    res.status(500).json ( { error: 'UPDATE::'+error.message})
  }
})

router.delete('transactions/:id', async (req,res) => {
  try {
    const t = await Transaction.findByIdAndDelete(req.params.id)
    res.status(200).json( { message: 'Transaction deleted!'})
  } catch (error) {
    res.status(404).json( { error: 'DELETE::transaction not found'}) 
  }
})

module.exports = router

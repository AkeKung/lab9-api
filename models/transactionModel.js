const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  _uid:{type:mongoose.ObjectId, required: true},
  name: { type: String,required: true},
  amount: {  type: Number, required: true},
  created: {  type: Date,  required: true,  default: Date.now},
  updated: {   type: Date, required: true, default: Date.now }
})

//.model(export-name, schema, collection-name)
module.exports = mongoose.model('Transaction', transactionSchema)
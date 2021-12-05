const mongoose = require('mongoose')
// extract the Schema
// const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  token: String
},
{
  timestamps: true,
  toJSON: {
    // remove `hashedPassword` field when we call `.toJSON`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)

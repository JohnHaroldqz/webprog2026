import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: String,
  password: String,
}, {
  timestamps: true
})

const User = model('User', userSchema)

export default User

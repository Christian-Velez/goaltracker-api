import mongooseUniqueValidator from 'mongoose-unique-validator'
import { Schema, model } from 'mongoose'

const userSchema = new Schema(
   {
      name: {
         type: Schema.Types.String,
         required: true,
      },
      email: {
         type: Schema.Types.String,
         required: true,
         unique: true,
         immutable: true,
      },
      password: {
         type: Schema.Types.String,
         required: true,
      },

      img: Schema.Types.String,
   },

   { timestamps: true }
)

userSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      delete returnedObject.password
      delete returnedObject._id
      delete returnedObject.__v
   },
})

userSchema.plugin(mongooseUniqueValidator)
export const User = model('User', userSchema)

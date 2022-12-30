import { Schema, model } from 'mongoose'

const projectSchema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      title: {
         type: Schema.Types.String,
         required: true,
         maxLength: 20,
      },
      description: {
         type: Schema.Types.String,
         maxLength: 250,
      },
      color: Schema.Types.String,
   },

   { timestamps: true }
)

export const Project = model('Project', projectSchema)

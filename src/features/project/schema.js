import { Schema, model } from 'mongoose'

const projectSchema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      title: {
         type: Schema.Types.String,
         required: true,
      },
      color: Schema.Types.String,
   },

   { timestamps: true }
)

export const Project = model('Project', projectSchema)

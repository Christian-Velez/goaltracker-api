import { Schema, model } from 'mongoose'

const dayStatusSchema = new Schema(
   {
      projectId: {
         type: Schema.Types.ObjectId,
         ref: 'Project',
         required: true,
      },

      date: {
         type: Schema.Types.Date,
         required: true,
      },

      value: Schema.Types.Number,
   },

   { timestamps: true }
)

dayStatusSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      delete returnedObject.__v
   },
})

export const DayStatus = model('DayStatus', dayStatusSchema)

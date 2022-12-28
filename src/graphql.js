import { GraphQLError } from 'graphql'

export class NotFoundError extends GraphQLError {
   constructor() {
      super('The resource requested could not be found on this server.', {
         extensions: {
            code: 'NOT_FOUND',
         },
      })
   }
}

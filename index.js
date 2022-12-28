import './src/db.js'
import jwt from 'jsonwebtoken'
import { ApolloServer, gql } from 'apollo-server'
import {
   User,
   UserMutations,
   UserMutationsDefs,
   UserQueries,
   UserQueriesDefs,
   UserTypeDefs,
} from './src/features/user/index.js'

import {
   ProjectMutations,
   ProjectMutationsDefs,
   ProjectQueries,
   ProjectQueriesDefs,
   ProjectTypeDefs,
} from './src/features/project/index.js'
import {
   StatusMutations,
   StatusMutationsDefs,
   StatusTypeDefs,
} from './src/features/status/index.js'

const resolvers = {
   Query: {
      ...UserQueries,
      ...ProjectQueries,
   },

   Mutation: {
      ...UserMutations,
      ...ProjectMutations,
      ...StatusMutations,
   },

   Project: {
      id: (root) => root._id,
   },
   Status: {
      id: (root) => root._id,
   },
}

const typeDefs = gql`
   ${UserTypeDefs}
   ${StatusTypeDefs}
   ${ProjectTypeDefs}

   type Query {
      ${UserQueriesDefs}
      ${ProjectQueriesDefs}
   }

   type Mutation {
      ${UserMutationsDefs}
      ${ProjectMutationsDefs}
      ${StatusMutationsDefs}
   }
`

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLocaleLowerCase().startsWith('bearer ')) {
         const token = auth.substring(7)
         const decodedtoken = jwt.verify(token, process.env.JWT_SECRET)
         const currentUser = await User.findById(decodedtoken.id)
         return { currentUser }
      }
   },
   persistedQueries: false,
})

server.listen().then(({ url }) => {
   console.log(`Listening on ${url}`)
})

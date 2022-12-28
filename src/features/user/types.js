export const UserTypeDefs = `
   type User {
      id: ID!
      name: String
      email: String!
      img: String
   }

   type UserResponse {
      user: User!
      token: String!
   }
`

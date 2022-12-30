export const ProjectTypeDefs = `
   type Project {
      id: ID!
      title: String!
      description: String
      color: String!
      daysAchieved: Int
      statusList: [Status]
   }
`

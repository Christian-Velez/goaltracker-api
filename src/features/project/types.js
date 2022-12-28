export const ProjectTypeDefs = `
   type Project {
      id: ID!
      title: String!
      color: String!
      daysAchieved: Int
      statusList: [Status]
   }
`

export const StatusTypeDefs = `
  type Status {
      id: ID
      date: String
      value: Int
   }

   type CreateStatusResponse {
      status: Status
      newCount: Int
   }

   type DeleteStatusResponse {
      id: ID
      newCount: Int
   }

`

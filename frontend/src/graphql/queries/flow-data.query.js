import { gql } from "apollo-boost";

const GET_FLOW_DATA_BY_STATUS = gql`
  query getFlowDataByStatus(
    $status: String!
    $invoice_requisition_id: String!
    $invoice_id: String!
  ) {
    flowDatas(
      status: $status
      invoice_requisition_id: $invoice_requisition_id
      invoice_id: $invoice_id
    ) {
      id
      name
      value
    }
  }
`;

export { GET_FLOW_DATA_BY_STATUS };

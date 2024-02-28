import { gql } from "apollo-boost";

const UPLOAD_MEDIA_OBJECT = gql`
  mutation uploadMediaObject($mediaFile: String!) {
    changeMutationMediaObject(input: { mediaFile: $mediaFile }) {
      mediaObject {
        id
        base64
      }
    }
  }
`;

export { UPLOAD_MEDIA_OBJECT };

import { gql } from "apollo-boost";

const CREATE_POST = gql`
  mutation createPost(
    $title: String!
    $linkPost: String
    $lang: String! = "ru-ru"
    $content: String
    $description: String
    $author: String
    $metaTitle: String
    $metaDescription: String
    $metaUrl: String!
    $imageDescription: String
    $fileCropped: String
    $fileOriginal: String
    $pairUnits: [String]
  ) {
    createPost(
      input: {
        title: $title
        linkPost: $linkPost
        lang: $lang
        content: $content
        description: $description
        author: $author
        metaTitle: $metaTitle
        metaDescription: $metaDescription
        metaUrl: $metaUrl
        imageDescription: $imageDescription
        fileCropped: $fileCropped
        fileOriginal: $fileOriginal
        pairUnits: $pairUnits
      }
    ) {
      post {
        id
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost(
    $id: ID!
    $title: String!
    $linkPost: String
    $lang: String
    $content: String
    $description: String
    $author: String
    $metaTitle: String
    $metaDescription: String
    $metaUrl: String!
    $imageDescription: String
    $createdAt: Int
    $fileCropped: String
    $fileOriginal: String
    $pairUnits: [String]
  ) {
    updatePost(
      input: {
        id: $id
        title: $title
        linkPost: $linkPost
        lang: $lang
        content: $content
        description: $description
        author: $author
        metaTitle: $metaTitle
        metaDescription: $metaDescription
        metaUrl: $metaUrl
        imageDescription: $imageDescription
        createdAt: $createdAt
        fileCropped: $fileCropped
        fileOriginal: $fileOriginal
        pairUnits: $pairUnits
      }
    ) {
      post {
        id
      }
    }
  }
`;

const UPDATE_PUBLISH_POST = gql`
  mutation updatePublishPost($postId: ID!, $publish: Boolean!) {
    updatePost(input: { id: $postId, publish: $publish }) {
      post {
        publish
      }
    }
  }
`;

export { CREATE_POST, UPDATE_PUBLISH_POST, UPDATE_POST };

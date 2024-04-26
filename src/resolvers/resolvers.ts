import {IResolvers} from "graphql-tools/dist/Interfaces.js";
import {
    createUserMutation,
    deleteUserMutation,
    getAuthorForCommentResolver,
    getAuthorForUserResolver,
    getUsersQueryResolver
} from "./users.js";
import {
    createPostMutation,
    deletePostMutation,
    getPostForCommentResolver,
    getPostsForUserResolver,
    getPostsQueryResolver
} from "./posts.js";
import {
    createCommentMutation,
    deleteCommentMutation,
    getCommentsForPostResolver,
    getCommentsForUserResolver,
    getCommentsQueryResolver
} from "./comments.js";

const resolvers: IResolvers = {
    Query: {
        users: getUsersQueryResolver,
        posts: getPostsQueryResolver,
        comments: getCommentsQueryResolver
    },
    Mutation: {
        createUser: createUserMutation,
        createPost: createPostMutation,
        createComment: createCommentMutation,
        deleteUser: deleteUserMutation,
        deletePost: deletePostMutation,
        deleteComment: deleteCommentMutation
    },
    User: {
        posts: getPostsForUserResolver,
        comments: getCommentsForUserResolver
    },
    Post: {
        comments: getCommentsForPostResolver,
        author: getAuthorForUserResolver
    },
    Comment: {
        author: getAuthorForCommentResolver,
        post: getPostForCommentResolver
    }
}

export {resolvers};

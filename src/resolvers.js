import { v4 } from "uuid";
import { ds } from "./datastore.js";
const resolvers = {
    Query: {
        users(_parent, { id }, _ctx, _info) {
            if (!id) {
                return ds.users;
            }
            return ds.users.filter(user => user.id === id);
        },
        posts(_parent, args, _ctx, _info) {
            if (!args.id) {
                return ds.posts;
            }
            return ds.posts.filter(user => user.id === args.id);
        },
        comments(_parent, _args, _ctx, _info) {
            return ds.comments;
        }
    },
    Mutation: {
        createUser(_parent, { userInput }, _ctx, _info) {
            let user = Object.assign({ id: v4() }, userInput);
            ds.users.push(user);
            return user;
        },
        createPost(_parent, { authorId, postInput }, _ctx, _info) {
            if (!ds.users.some(user => user.id === authorId)) {
                throw new Error('Author ' + authorId + ' not found');
            }
            let post = Object.assign(Object.assign({ id: v4() }, postInput), { authorId });
            ds.posts.push(post);
            return post;
        },
        createComment(_parent, { authorId, postId, commentInput }, _ctx, _info) {
            if (!ds.users.some(user => user.id === authorId)) {
                throw new Error('Author ' + authorId + ' not found');
            }
            if (!ds.posts.some(post => post.id === postId)) {
                throw new Error('Post ' + postId + ' not found');
            }
            let comment = Object.assign(Object.assign({ id: v4() }, commentInput), { authorId, postId });
            ds.comments.push(comment);
            return comment;
        },
        deleteUser(_parent, { userId }, _ctx, _info) {
            ds.users = ds.users.filter(user => user.id !== userId);
            ds.posts.filter(post => post.authorId === userId)
                .map(post => post.id)
                .forEach(postId => this.deletePost(undefined, { postId }));
            ds.comments = ds.comments.filter(comment => comment.authorId !== userId);
        },
        deletePost(_parent, { postId }, _ctx, _info) {
            ds.posts = ds.posts.filter(value => value.id !== postId);
            ds.comments = ds.comments.filter(value => value.postId !== postId);
        },
        deleteComment(_parent, { commentId }, _ctx, _info) {
            ds.comments = ds.comments.filter(value => value.id === commentId);
        }
    },
    User: {
        posts(parent) {
            return ds.posts.filter(post => post.authorId === parent.id);
        },
        comments(parent) {
            return ds.comments.filter(comment => comment.authorId === parent.id);
        }
    },
    Post: {
        comments(parent) {
            return ds.comments.filter(comment => comment.postId === parent.id);
        },
        author(parent) {
            return ds.users.find(user => user.id === parent.authorId);
        }
    },
    Comment: {
        author(parent) {
            return ds.users.find(value => value.id === parent.authorId);
        },
        post(parent) {
            return ds.posts.find(value => value.id === parent.authorId);
        }
    }
};
export { resolvers };

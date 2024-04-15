import {IResolvers} from "graphql-tools/dist/Interfaces.js";
import {v4} from "uuid";
import {Comment, CommentInput, Post, PostInput, User, UserInput} from "./model.js";
import {ds} from "./datastore.js";

const resolvers: IResolvers = {
    Query: {
        users(_parent: any, {id}: { id: String }, _ctx: any, _info: any): User[] {
            if (!id) {
                return ds.users;
            }
            return ds.users.filter(user => user.id === id);
        },
        posts(_parent: any, args: { id: String }, _ctx: any, _info: any): Post[] {
            if (!args.id) {
                return ds.posts;
            }
            return ds.posts.filter(user => user.id === args.id);
        },
        comments(_parent: any, _args: any, _ctx: any, _info: any): Comment[] {
            return ds.comments;
        }
    },
    Mutation: {
        createUser(_parent: any, {userInput}: { userInput: UserInput }, _ctx: any, _info: any): User {
            let user: User = {id: v4(), ...userInput};
            ds.users.push(user);
            return user;
        },
        createPost(
            _parent: any,
            {authorId, postInput}: { authorId: string, postInput: PostInput },
            _ctx: any,
            _info: any
        ): Post {

            if (!ds.users.some(user => user.id === authorId)) {
                throw new Error('Author ' + authorId + ' not found');
            }

            let post: Post = {id: v4(), ...postInput, authorId};
            ds.posts.push(post);
            return post;
        },
        createComment(
            _parent: any,
            {authorId, postId, commentInput}: { authorId: string, postId: string, commentInput: CommentInput },
            _ctx: any,
            _info: any
        ): Comment {

            if (!ds.users.some(user => user.id === authorId)) {
                throw new Error('Author ' + authorId + ' not found');
            }

            if (!ds.posts.some(post => post.id === postId)) {
                throw new Error('Post ' + postId + ' not found');
            }

            let comment: Comment = {id: v4(), ...commentInput, authorId, postId};
            ds.comments.push(comment);
            return comment;
        },
        deleteUser(
            _parent: any,
            {userId}: { userId: string },
            _ctx: any,
            _info: any
        ) {
            ds.users = ds.users.filter(user => user.id !== userId);
            ds.posts.filter(post => post.authorId === userId)
                .map(post => post.id)
                .forEach(postId => this.deletePost(undefined, {postId}));
            ds.comments = ds.comments.filter(comment => comment.authorId !== userId);
        },
        deletePost(
            _parent: any,
            {postId}: { postId: string },
            _ctx: any,
            _info: any
        ) {
            ds.posts = ds.posts.filter(value => value.id !== postId);
            ds.comments = ds.comments.filter(value => value.postId !== postId);
        },
        deleteComment(
            _parent: any,
            {commentId}: { commentId: string },
            _ctx: any,
            _info: any
        ) {
            ds.comments = ds.comments.filter(value => value.id === commentId);
        }
    },
    User: {
        posts(parent: User): Post[] {
            return ds.posts.filter(post => post.authorId === parent.id);
        },
        comments(parent: User): Comment[] {
            return ds.comments.filter(comment => comment.authorId === parent.id);
        }
    },
    Post: {
        comments(parent: Post): Comment[] {
            return ds.comments.filter(comment => comment.postId === parent.id);
        },
        author(parent: Post): User | undefined {
            return ds.users.find(user => user.id === parent.authorId)
        }
    },
    Comment: {
        author(parent: Comment): User | undefined {
            return ds.users.find(value => value.id === parent.authorId);
        },
        post(parent: Comment): Post | undefined {
            return ds.posts.find(value => value.id === parent.authorId);
        }
    }
}


export {resolvers};
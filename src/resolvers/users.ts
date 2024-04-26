import {ds} from "../datastore/datastore.js";
import {v4} from "uuid";
import {deletePostMutation} from "./posts.js";
import {Comment, Post, User, UserInput} from "../model/model.js";

const getUsersQueryResolver = function (_parent: any, {id}: { id: String }, _ctx: any, _info: any): User[] {
    if (!id) {
        return ds.users;
    }
    return ds.users.filter(user => user.id === id);
}

const createUserMutation = function (_parent: any, {userInput}: { userInput: UserInput }, _ctx: any, _info: any): User {
    let user: User = {id: v4(), ...userInput};
    ds.users.push(user);
    return user;
}

const deleteUserMutation = function deleteUser(
    _parent: any,
    {userId}: { userId: string },
    _ctx: any,
    _info: any
) {
    ds.users = ds.users.filter(user => user.id !== userId);
    ds.posts.filter(post => post.authorId === userId)
        .map(post => post.id)
        .forEach(postId => deletePostMutation(undefined, {postId}));
    ds.comments = ds.comments.filter(comment => comment.authorId !== userId);
}

const getAuthorForUserResolver = function (parent: Post): User | undefined {
    return ds.users.find(user => user.id === parent.authorId)
}

const getAuthorForCommentResolver = function (parent: Comment): User | undefined {
    return ds.users.find(value => value.id === parent.authorId);
}

export {
    getUsersQueryResolver,
    createUserMutation,
    deleteUserMutation,
    getAuthorForUserResolver,
    getAuthorForCommentResolver
}

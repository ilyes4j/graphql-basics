import {ds} from "../datastore/datastore.js";
import {v4} from "uuid";
import {Comment, CommentInput, Post, User} from "../model/model.js";

const getCommentsQueryResolver = function (_parent: any, _args: any, _ctx: any, _info: any): Comment[] {
    return ds.comments;
}

const createCommentMutation = function (
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
}

const deleteCommentMutation = function (
    _parent: any,
    {commentId}: { commentId: string },
    _ctx: any,
    _info: any
) {
    ds.comments = ds.comments.filter(value => value.id === commentId);
}

const getCommentsForUserResolver = function (parent: User): Comment[] {
    return ds.comments.filter(comment => comment.authorId === parent.id);
}

const getCommentsForPostResolver = function (parent: Post): Comment[] {
    return ds.comments.filter(comment => comment.postId === parent.id);
}

export {
    getCommentsQueryResolver,
    createCommentMutation,
    deleteCommentMutation,
    getCommentsForUserResolver,
    getCommentsForPostResolver
}

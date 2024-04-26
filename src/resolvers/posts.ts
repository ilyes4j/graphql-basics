import {ds} from "../datastore/datastore.js";
import {v4} from "uuid";
import {Comment, Post, PostInput, User} from "../model/model.js";

const getPostsQueryResolver = function (_parent: any, args: { id: String }, _ctx: any, _info: any): Post[] {
    if (!args.id) {
        return ds.posts;
    }
    return ds.posts.filter(user => user.id === args.id);
}

const createPostMutation = function createPost(
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
}

const deletePostMutation = function (
    _parent: any,
    {postId}: { postId: string },
    _ctx?: any,
    _info?: any
) {
    ds.posts = ds.posts.filter(value => value.id !== postId);
    ds.comments = ds.comments.filter(value => value.postId !== postId);
}

const getPostsForUserResolver = function (parent: User): Post[] {
    return ds.posts.filter(post => post.authorId === parent.id);
}

const getPostForCommentResolver = function (parent: Comment): Post | undefined {
    return ds.posts.find(value => value.id === parent.authorId);
}

export
{
    getPostsQueryResolver,
    createPostMutation,
    deletePostMutation,
    getPostsForUserResolver,
    getPostForCommentResolver
}

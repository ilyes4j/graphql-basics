type UserInput = {
    name: string
    email: string
    age: number
};

type User = UserInput & {
    id: string
};

type PostInput = {
    title: string,
    body: string,
    published: boolean,
}

type Post = PostInput & {
    id: string,
    authorId: string
}

type CommentInput = {
    text: string
}

type Comment = CommentInput & {
    id: string
    authorId: string
    postId: string
}

export {
    User,
    Post,
    Comment,
    UserInput,
    CommentInput,
    PostInput
}
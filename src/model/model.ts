type CommentInput = {
    text: string
}

type Comment = CommentInput & {
    id: string
    authorId: string
    postId: string
}

type PostInput = {
    title: string,
    body: string,
    published: boolean,
}

type Post = PostInput & {
    id: string,
    authorId: string
}

type UserInput = {
    name: string
    email: string
    age: number
};

type User = UserInput & {
    id: string
};

export {
    Comment,
    CommentInput,
    Post,
    PostInput,
    User,
    UserInput
}

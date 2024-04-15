const userCount = 3;
const postCountPerUser = 1;
const generateId = (index) => {
    return index.toString().padStart(2, '0');
};
const generatePostId = (userIndex, postIndex) => {
    return generateId(userIndex) + '_' + generateId(postIndex);
};
const generateCommentId = (userIndex, postIndex, commentIndex) => {
    return generatePostId(userIndex, postIndex) + '_' + generateId(commentIndex);
};
const generateUser = (userIndex) => {
    const userId = generateId(userIndex);
    return {
        id: userId,
        age: userIndex,
        name: 'name.lastname.' + userId,
        email: 'name.lastname.' + userId + '@gmail.com'
    };
};
const generatePost = (userIndex, postIndex) => {
    const userId = generateId(userIndex);
    const postId = generatePostId(userIndex, postIndex);
    return {
        id: postId,
        title: 'Post title ' + postId,
        body: 'Post body ' + postId,
        published: true,
        authorId: userId
    };
};
/**
 * Create a comment with an id commentIndex created by authorIndex on a post with postIndex created by posterIndex
 * @param posterIndex the id of the creator of the post
 * @param postIndex the id of the post
 * @param commentIndex the id of the comment
 * @param authorIndex the id of the creator of the comment
 */
const generateComment = (posterIndex, postIndex, commentIndex, authorIndex) => {
    const authorId = generateId(authorIndex);
    const postId = generatePostId(posterIndex, postIndex);
    const commentId = generateCommentId(posterIndex, postIndex, commentIndex);
    return {
        id: commentId,
        text: 'Comment text' + commentId,
        authorId: authorId,
        postId: postId
    };
};
function generateDataset() {
    let users = [];
    let posts = [];
    let comments = [];
    for (let i = 0; i < userCount; i++) {
        users.push(generateUser(i));
        for (let j = 0; j < postCountPerUser; j++) {
            posts.push(generatePost(i, j));
            for (let k = 0, l = 0; k < userCount; k++) {
                if (Math.floor(Math.random() * 2)) {
                    comments.push(generateComment(i, j, l, k));
                    l++;
                }
            }
        }
    }
    const sortById = (a, b) => a.id.localeCompare(b.id);
    users.sort(sortById);
    posts.sort(sortById);
    comments.sort(sortById);
    return { users, posts, comments };
}
let ds = generateDataset();
export { ds };

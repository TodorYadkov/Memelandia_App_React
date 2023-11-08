const host = 'http://localhost:3000/';
const endpoint = {
    register: 'users/register', // post
    login: 'users/login', // post
    logout: 'users/logout', // get
    getUserBy: 'users/profile', // get
    updateUser: 'users/profile', // put
    forgottenPass: 'users/forgotten-password', // put
    addRemoveFavoriteMeme: (memeId) => `users/favorite/${memeId}`, // get
    getTopRatedMemes: 'memes/three-top-rated', // get
    getAllMemes: (page, limit) => `memes?page=${page}&limit=${limit}`, // get
    getMemeBySearch: (memeName, category, page, limit) => `memes/search?name=${memeName}&category=${category}&page=${page}&limit=${limit}`, // get
    getMemeById: (memeId) => `memes/get-one/${memeId}`, // get
    getMemeForUserById: (userId, page, limit) => `memes/gor-user/${userId}?page=${page}&limit=${limit}`, // get	
    addNewMeme: 'memes/create', // post
    updateMeme: (memeId) => `memes/edit/${memeId}`, // put
    deleteMeme: (memeId) => `memes/delete/${memeId}`, // delete
    addRemoveLikeMeme: (memeId) => `memes/like/${memeId}`, // get
    addRemoveDislikeMeme: (memeId) => `memes/dislike/${memeId}`, // get
    addNewComment: (memeId) => `memes/comments/${memeId}`, // post
    getAllComments: (memeId) => `memes/comments/${memeId}`, // get
    getCommentById: (commentId) => `memes/comments/get-one/${commentId}`, // get
    updateComment: (commentId) => `memes/comments/edit/${commentId}`, // put
    deleteComment: (commentId) => `memes/comments/delete/${commentId}`, // delete
};

const tokenName = '43j54FD345HfiR3413fdErl326MCVzQ4543TRv23Ipo57';

export {
    host,
    endpoint,
    tokenName
};
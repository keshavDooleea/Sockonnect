const users = [];

// join users to chat
function joinUser(id, username) {
    const user = { id, username };
    users.push(user);

    return users;
}

// get current user
function getCurrentUser(id) {
    return users.find(user => {
        user.id === id;
    });
}

module.exports = {
    joinUser,
    getCurrentUser
}
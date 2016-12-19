const userController = require('./user');
const categoryController = require('./category');
const commentController = require('./comment');

module.exports = {
    user: userController,
    category: categoryController,
    comment: commentController
};
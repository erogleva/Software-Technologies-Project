const userController = require('./../controllers/user');
const articleController = require('./../controllers/article');
const homeController = require('./../controllers/home');
const adminController = require('./../controllers/admin/admin');
const tagController = require('./../controllers/tag');
const commentController = require('./../controllers/comment');
const multer = require('multer');

module.exports = (app) => {
    app.get('/', homeController.index);
    app.get('/category/:id', homeController.listArticles);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/user/details/:id', userController.details);

    app.get('/article/create', articleController.createGet);
    app.post('/article/create', multer({ dest: './public/uploads/'}).single('upl'), articleController.createPost);

    app.get('/article/details/:id', articleController.details);

    app.get('/article/edit/:id', articleController.editGet);
    app.post('/article/edit/:id', multer({ dest: './public/uploads/'}).single('upl'), articleController.editPost);

    app.get('/article/delete/:id', articleController.deleteGet);
    app.post('/article/delete/:id', articleController.deletePost);

    app.get('/tag/:name', tagController.listArticlesByTag);

    app.get('/comment/create/:id', commentController.createGet);
    app.post('/comment/create/:id', commentController.createPost);


    app.use((req, res, next) => {
        if(!req.isAuthenticated()){
            res.redirect('/user/login');
        } else {
            req.user.isInRole('Admin').then(isAdmin => {
                if(isAdmin){
                    next();
                } else {
                    res.redirect('/');
                }
            })
        }
    });
    app.get('/admin/user/all', adminController.user.all);
    app.get('/admin/user/edit/:id', adminController.user.editGet);
    app.post('/admin/user/edit/:id', adminController.user.editPost);

    app.get('/admin/user/delete/:id', adminController.user.deleteGet);
    app.post('/admin/user/delete/:id', adminController.user.deletePost);

    app.get('/admin/category/all', adminController.category.all);
    app.get('/admin/category/create', adminController.category.createGet);
    app.post('/admin/category/create', adminController.category.createPost);

    app.get('/admin/category/edit/:id', adminController.category.editGet);
    app.post('/admin/category/edit/:id', adminController.category.editPost);

    app.get('/admin/category/delete/:id', adminController.category.deleteGet);
    app.post('/admin/category/delete/:id', adminController.category.deletePost);

    app.get('/admin/comment/edit/:id', adminController.comment.editGet);
    app.post('/admin/comment/edit/:id', adminController.comment.editPost);

    app.get('/admin/comment/delete/:id', adminController.comment.deleteGet);
    app.post('/admin/comment/delete/:id', adminController.comment.deletePost);

};


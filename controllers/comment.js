const Article = require('mongoose').model('Article');
const Comment = require('mongoose').model('Comment');

module.exports = {

    createGet: (req, res) => {
        let id = req.params.id;
        Article.findById(id).populate('author tags').then (article => {
                res.render('comment/create', { article: article});
        })
    },

    createPost: (req, res) => {
        let articleId = req.params.id;
        let commentArgs = req.body;
        commentArgs.article = articleId;


        Comment.create(commentArgs).then(comment => {
            Article.findById(articleId).then(article => {
                article.comments.push(comment.id);
                article.save();
                res.redirect(`/article/details/${articleId}`);

            })
        })
    },

    editGet: (req, res) => {
        let id = req.params.id;

        Comment.findById(id).then(comment => {
            res.render('comment/edit', comment);
        })
    },

    editPost: (req, res) => {
        let id = req.params.id;
        let commentArgs = req.body;

        Comment.findById(id).then(comment => {
            comment.authorEmail = commentArgs.authorEmail;
            comment.authorFullName = commentArgs.authorFullName;
            comment.content = commentArgs.content;

            comment.save();

            res.redirect('/');
            })
    },

    deleteGet: (req, res) => {
        let id = req.params.id;

        Comment.findById(id).then(comment => {
            res.render('comment/delete', comment);
        })
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Comment.findOneAndRemove({_id: id}).then(comment => {
                    Article.findById(comment.article).then(article => {
                        article.comments.remove(comment.id);
                        article.save();
                        res.redirect('/');
                    })
            })
    }
};
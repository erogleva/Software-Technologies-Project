const Article = require('mongoose').model('Article');
const Comment = require('mongoose').model('Comment');

module.exports = {
    editGet: (req, res) => {
        let id = req.params.id;

        Comment.findById(id).then(comment => {
            res.render('admin/comment/edit', comment);
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
            res.render('admin/comment/delete', comment);
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



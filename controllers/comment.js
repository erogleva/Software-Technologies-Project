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

        let regexPattern = /\w{5,}@\w+.\w+/g;
        let isMatching = commentArgs.authorEmail.match(regexPattern);

        if(!isMatching){
            let errorMsg = 'Please enter a valid email!';
            Article.findById(articleId).populate('author tags').then(article => {
                res.render('comment/create', {article: article, error: errorMsg});
            })
        } else {
            commentArgs.article = articleId;
            Comment.create(commentArgs).then(comment => {
                Article.findById(articleId).then(article => {
                    article.comments.push(comment.id);
                    article.save();
                    res.redirect(`/article/details/${articleId}`);
                })
            })
        }
    },

};
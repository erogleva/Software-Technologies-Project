const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');

module.exports = {
  index: (req, res) => {
      Article.find({}).limit(6).populate('author tags').then(articles => {
          Category.find({}).then(categories => {
              res.render('home/index',{articles: articles, categories: categories});
          })
      })
  },

    listArticles: (req, res) => {
       let id = req.params.id;
        Category.findById(id).populate('articles').then(category => {
            User.populate(category.articles, {path: 'author'}, (err) => {
                if (err) {
                    console.log(err.message);
                }

                Tag.populate(category.articles, {path: 'tags'}, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    res.render('home/articles', {articles: category.articles})
                });
            });
        });
    }
};
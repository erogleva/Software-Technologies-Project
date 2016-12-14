const mongoose = require ('mongoose');
const Category = mongoose.model('Category');

module.exports = {
    all: (req, res) => {
       Category.find({}).then(categories => {
           res.render('admin/category/all', {categories: categories});
       })
    },

    createGet: (req, res) => {
        res.render('admin/category/create');
    },

    createPost: (req, res) => {
        let createArgs = req.body;
        if(!createArgs.name){
            let errorMsg = 'Category name cannot be null!';
            createArgs.error = errorMsg;
            res.render('admin/category/create', createArgs);
        } else {
            Category.create(createArgs).then(category => {
                res.redirect('/admin/category/all');
            })
        }
    },

    editGet: (req, res) => {
        let id = req.params.id;

        Category.findById(id).then(category => {
            res.render('admin/category/edit', {category: category});
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;
        let editArgs = req.body;

        if(!editArgs.name){
            let errorMessage = 'Category Name cannot be null!';

            Category.findById(id).then(category => {
                res.render('admin/category/edit', {category: category, error: errorMessage});
            });
        } else {
            Category.findOneAndUpdate({_id:id}, {name: editArgs.name}).then(category => {
                res.redirect('/admin/category/all');
            })
        }
    },

    deleteGet: (req, res) => {
        let id = req.params.id;

        Category.findById(id).then(category => {
            res.render('admin/category/delete', {category: category});
        });


    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Category.findOneAndRemove({_id: id}).then(category => {
            category.prepareDelete();
            res.redirect('/admin/category/all');
        });
    }
};
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');
const Tag = require('mongoose').model('Tag');
const encryption = require('./../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost:(req, res) => {
        let registerArgs = req.body;

        User.findOne({email: registerArgs.email}).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }

            let regexPattern = /\w{5,}@\w+.\w+/g;
            let isMatching = registerArgs.email.match(regexPattern);

            if(!isMatching){
                errorMsg = 'Invalid Email!'
            }



            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs)
            } else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let userObject = {
                    email: registerArgs.email,
                    passwordHash: passwordHash,
                    fullName: registerArgs.fullName,
                    salt: salt
                };

                let roles = [];
                Role.findOne({name: 'User'}).then(role => {
                    roles.push(role.id);

                    userObject.roles = roles;
                    User.create(userObject).then(user => {
                        role.users.push(user);
                        role.save(err => {
                            if(err) {
                                registerArgs.error = err.message;
                                res.render('user/register', registerArgs);
                            }
                            else {
                                req.logIn(user, (err) => {
                                    if (err) {
                                        registerArgs.error = err.message;
                                        res.render('user/register', registerArgs);
                                        return;
                                    }

                                    res.redirect('/');
                                })
                            }
                        });
                    });
                });
            }
        })
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({email: loginArgs.email}).then(user => {
            if (!user ||!user.authenticate(loginArgs.password)) {
                let errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    res.render('/user/login', {error: err.message});
                    return;
                }

                let returnUrl = '/';
                if(req.session.returnUrl) {
                    returnUrl = req.session.returnUrl;
                    delete req.session.returnUrl;
                }

                res.redirect(returnUrl);
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },

    details: (req, res) => {

        let id = req.params.id;

        if(!req.isAuthenticated()){
                let returnUrl = `/user/details/${id}`;
                req.session.returnUrl = returnUrl;
                res.redirect('/user/login');
                return;
        }

        if(req.user.id !== id){
            let returnUrl = `/user/details/${id}`;
            req.session.returnUrl = returnUrl;
            res.redirect('/user/login');
            return;
        }

        User.findById(id).populate('articles').then(user => {
                Tag.populate(user.articles, {path: 'tags'}, (err) => {
                    if (err) {
                        console.log(err.message);
                    }

                    if(req.user.id === id){
                        res.render('user/details', {user: user, isUserAuthorized: true});
                    } else {
                        res.render('user/details', {user: user, isUserAuthorized: false});
                    }
                })
            });
    }
};

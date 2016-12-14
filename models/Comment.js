const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    title: {type: String},
    content: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},

    // author should be User or Visitor: how to implement this?

});

//userSchema.set('versionKey', false); да проверя за какво служи

const Comment = mongoose.model('Comment', tagsSchema);
module.exports = Comment;
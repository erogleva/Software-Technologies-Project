const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    content: {type: String, required: true},
    authorEmail: {type: String, required: true},
    authorFullName: {type: String, required: true},
    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'}
});


commentSchema.set('versionKey', false);
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
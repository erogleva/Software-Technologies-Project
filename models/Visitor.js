const mongoose = require('mongoose');

let visitorSchema = mongoose.Schema({
    email: {type: String, required: true},
    fullName: {type: String, required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}]
});

//userSchema.set('versionKey', false);

const Visitor = mongoose.model('Visitor', tagsSchema);
module.exports = Visitor;

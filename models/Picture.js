const mongoose = require('mongoose');

let pictureSchema = mongoose.Schema({

    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'}
});

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;
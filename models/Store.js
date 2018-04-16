const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, // no spaces
        required: 'required',
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String],
});

storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name);
    next();
    // TODO: make slugs unique
});

module.exports = mongoose.model('Store', storeSchema);

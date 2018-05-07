const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, // no spaces
        required: 'Name is REQUIRED',
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [
            {
                type: Number,
                required: 'Coordinates are REQUIRED',
            },
        ],
        address: {
            type: String,
            required: 'Address is REQUIRED',
        },
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Author is REQUIRED',
    },
});

storeSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name);
    // find other stores with the same slug as a, a-1, a-2
    // i - case sensitive
    // ^ - starts with
    // $ - end with
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlug) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
};

module.exports = mongoose.model('Store', storeSchema);

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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Define indexes
storeSchema.index({
    name: 'text',
    description: 'text',
});

storeSchema.index({ location: '2dsphere' });

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

storeSchema.statics.getTopStores = function() {
    return this.aggregate([
        // Lookup Stores and populate their reviews
        // from value is actually a model name but in lowercase and with 's' in the end
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' } },
        // Filter for only items that have 2 or more reviews
        { $match: { 'reviews.1': { $exists: true } } },
        // Add the average reviews field
        { $addFields: { averageRating: { $avg: '$reviews.rating' } } },
        // Sort it by new field, highest reviews firsts
        { $sort: { averageRating: -1 } },
        // Limit to at most 100
        { $limit: 10 },
    ]);
};

// find reviews where the stores _id property === reviews store property
// equals to SQL Join thing
// virtual fields don't go to the object or json unless it's explicitly asked to
storeSchema.virtual('reviews', {
    ref: 'Review', // what model to link
    localField: '_id', // which field on the store
    foreignField: 'store', // which field on the store
});

function autoPopulate(next) {
    this.populate('reviews');
    next();
}

storeSchema.pre('find', autoPopulate);
storeSchema.pre('findOne', autoPopulate);

module.exports = mongoose.model('Store', storeSchema);

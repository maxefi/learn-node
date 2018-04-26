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

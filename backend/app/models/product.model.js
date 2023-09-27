const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');


const ProductSchema = mongoose.Schema({
    slug: { 
        type: String, 
        lowercase: true, 
        unique: true 
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    id_cat: { 
        type: mongoose.Schema.Types.ObjectId
}});

ProductSchema.plugin(uniqueValidator, { msg: "already taken" });
ProductSchema.pre('validate',  async function (next) {
    if (!this.slug) {
        console.log('dentro del if');
        await this.slugify();
    }
    console.log(this.slug);  
    next();
});

ProductSchema.methods.slugify = async function () {
    this.slug = slugify(this.name) + '-' + (Math.random() * Math.pow(36, 10) | 0).toString(36);
};


module.exports = mongoose.model('Product', ProductSchema);
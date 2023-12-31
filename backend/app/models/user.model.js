const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    favouriteProduct: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followersUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true
    });

userSchema.plugin(uniqueValidator);

userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({
            "user": {
                "id": this._id,
                "email": this.email,
                "password": this.password
            }
        },
        process.env.ACCESS_TOKEN_SECRET || "yomogan",
        { expiresIn: "1d"}
    );
    return accessToken;
}

userSchema.methods.toUserResponse = function() {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken()
    }
};

userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user.Following(this._id)
    }
};

userSchema.methods.toProfileUnloggedJSON = function () {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image
    }
};

userSchema.methods.toSeeProfileUser = function (user_logged,followers,n_followers,follows,n_follows,products) {
    if (user_logged){
        return {
            username: this.username,
            bio: this.bio,
            image: this.image,
            followers: followers,
            n_followers: n_followers,
            follows: follows,
            n_follows: n_follows,
            following: user_logged.Following(this._id),
            products: products
        }
    } else {
        return {
            username: this.username,
            bio: this.bio,
            image: this.image,
            followers: followers,
            n_followers: n_followers,
            follows: follows,
            n_follows: n_follows,
            following: false,
            products: products
        }
    }
};

userSchema.methods.isFavorite = function (id) {
    const idStr = id.toString();
    for (const article of this.favouriteProduct) {
        if (article.toString() === idStr) {
            return true;
        }
    }
    return false;
}

userSchema.methods.favorite = function (id) {
    if(this.favouriteProduct.indexOf(id) === -1){
        this.favouriteProduct.push(id);
    }
    return this.save();
}

userSchema.methods.unfavorite = function (id) {
    if(this.favouriteProduct.indexOf(id) !== -1){
        this.favouriteProduct.remove(id);
    }
    return this.save();
};

//FOLLOWS

userSchema.methods.Following = function (id) {
    
    const idStr = id.toString();
    
    for (const followingUser of this.followingUsers) {
        if (followingUser.toString() === idStr) {
            return true;
        }
    }
    return false;
};



userSchema.methods.follow = function (id) {
    if(this.followingUsers.indexOf(id) === -1){
        this.followingUsers.push(id);
    }
    return this.save();
};

userSchema.methods.unfollow = function (id) {
    if(this.followingUsers.indexOf(id) !== -1){
        this.followingUsers.remove(id);
    }
    return this.save();
};

userSchema.methods.addFollower = function (id) {
    if(this.followersUsers.indexOf(id) === -1){
        this.followersUsers.push(id);
    }
    return this.save();
};

userSchema.methods.removeFollower = function (id) {
    if(this.followersUsers.indexOf(id) !== -1){
        this.followersUsers.remove(id);
    }
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
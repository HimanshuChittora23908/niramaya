const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;

const profileSchema = new Schema({
    userId: {
       type: ObjectId,
       ref: 'user'
    },
    profilePicture: {
        type: String
    },
    bio: {
        type: String
    },
    goals: {
        type: [String]
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    }
});

const Profile = mongoose.model('profile', profileSchema);
module.exports = Profile;
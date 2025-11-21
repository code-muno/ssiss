const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [ true, 'Please add Name'],
    },

    email: {
        type: String,
        required: [ true, 'Please add Email'],
        unique: true,
        index: true,
    },
    passwordHash: {
        type: String,
        required: [ true, 'Please add Password'],
    },
    role: {
        type: String,
        enum: ['owner', 'admin', 'staff', 'cashier'],
        default: 'owner'
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business', 
    },
    isEmailVerified: {
        type: Boolean,
        default: false,},
}, {
    timestamps: true,   
});

module.exports = model('User', userSchema);
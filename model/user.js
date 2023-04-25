const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname is required'],
        minlength: [3, 'firstname must be equal or more than 3 characters'],
		maxlength: [30, 'firstname must be equal or less than 30 characters'],
		trim: true
    },
    lastname: {
        type: String,
        required: [true, 'lastname is required'],
        minlength: [3, 'lastname must be equal or more than 3 characters'],
		maxlength: [30, 'lastname must be equal or less than 30 characters'],
		trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: value => {
                if (!value.length) return false;

                // const regexValidation = /[0-9][a-z]/g
                // console.log('regex====>',value.match(regexValidation))
                // if(!value.match(regexValidation)) return false;

                if(!value.match(/[0-9]/)) return false;
                if(!value.match(/[a-z]/i)) return false;

                return true;
            },
            message: 'invalid password! password requirements (at least 8 characters,at least one number,at least 1 letter)'
        },
        
        
    },
    gender: {
        type: String,
        enum: {
            values: ['not-set', 'male', 'female'],
            message: 'invalid gender ({VALUE}): gender is eather male or female'
        },
        default: 'not-set',
        trim: true,
        lowercase: true
    },
    role: {
        type : String,
        enum: {
            values: ['user', 'admin'],
            message: 'invalid role ({VALUE})'
        },
        default: 'user',
        trim: true,
        lowercase: true
    }
    
}, {
    timestamps: true
});

UserSchema.pre("save", async function(next) {
    if (!this.isNew && !this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        return next();
    } catch (err) {
        next(err);
    };
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};


module.exports = mongoose.model('user', UserSchema);
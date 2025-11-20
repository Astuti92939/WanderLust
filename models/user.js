const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passwordLocalMongoose = require("passport-local-mongoose");

const userSchema = new schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passwordLocalMongoose);

module.exports = mongoose.model('user',userSchema);
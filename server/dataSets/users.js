var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        email : {type: String, unique: true,required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        password:{type: String, required: true},
        userType: { type: String, enum: ['Admin','uploader','normal'],default: 'normal'}

    }
);

UserSchema.virtual('url').get(function(){
    return 'api/user/'+this._id;
});

module.exports=mongoose.model('User',UserSchema);


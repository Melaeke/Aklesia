var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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

//Note that the pre function doesn't support the ES6 (()=>{}) function syntax.
//hashing password before savig to databse.
UserSchema.pre('save',function(next){
    var user=this;
    bcrypt.hash(user.password,10,(err,hash)=>{
        if(err){
            console.error(err);
            return next(err);
        }
        user.password=hash;
        next();
    });
});

//hashing password before updating the password.
UserSchema.pre('findOneAndUpdate',function(next){
    if(this._update.password){
        bcrypt.hash(this._update.password,10,(err,hash)=>{
            if(err){
                console.error(err);
                return next(err);
            }
            this._update.password=hash;
            next();
        });
    }
});

UserSchema.virtual('url').get(function(){
    return 'api/user/'+this._id;
});

module.exports=mongoose.model('User',UserSchema);


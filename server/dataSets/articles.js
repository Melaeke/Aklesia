var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: { type: String, required: true},
    shortDescription: {type: String, max: 100},
    content:{type: String},
    created_time: {type: Date,default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User',required: true},
    type: {type: Schema.ObjectId, ref: 'ArticleType', required: true},
    lastUpdated: {type: Date}
});

ArticleSchema.pre('save',function(next){
    this.lastUpdated=new Date();
    next();
})

//added to support lastUpdated time.
ArticleSchema.pre('findOneAndUpdate',function(next){
    this._update.lastUpdated = new Date();
    next();
});

ArticleSchema.virtual('url').get(function(){
    return 'api/article/'+this._id;
});

module.exports= mongoose.model('Article',ArticleSchema);
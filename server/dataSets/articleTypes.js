var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ArticleTypeSchema = new Schema(
    {
        name: {type: String, required:true}
    }
);

ArticleTypeSchema.virtual('url').get(function(){
    return 'api/articleType/'+this._id;
})

module.exports = mongoose.model('ArticleType',ArticleTypeSchema);
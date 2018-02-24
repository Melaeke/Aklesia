var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PageSchema = new Schema(
    {
        name : {type: String, unique: true, required: true},
        articles: [{type: Schema.ObjectId, ref: 'Article'}]
    }
);

PageSchema.virtual('url').get(function(){
    return 'api/pages/'+this._id;
});

module.exports=mongoose.model('Page',PageSchema);


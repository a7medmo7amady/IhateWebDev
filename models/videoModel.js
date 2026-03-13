const mongoose = require("mongoose");

const vidSchema = new mongoose.Schema({
    user :{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title : { type: String, required: true },
    description : { type: String, required: true }},{
        timestamps:true
    }
)
const Video = mongoose.model('Video', vidSchema);

module.exports = Video;
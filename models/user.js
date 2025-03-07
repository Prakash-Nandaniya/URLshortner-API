import mongoose from "mongoose";

const Schema = mongoose.Schema;
const user_schema = new Schema({
    username: {
        type: String,
        required: true,  
    },
    password: {
        type: String,
        required:true,
    },
}, {
    strict: false, 
    timestamps: true, 
    versionKey: false, 
});

const user = mongoose.model('user_data', user_schema);

export default user
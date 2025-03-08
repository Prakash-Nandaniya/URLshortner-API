import mongoose from "mongoose";

const Schema = mongoose.Schema;
const url_schema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    short_url: {
        type: String,
        unique: true,
        required: true,
    },
    clicks_count: {
        type: Number,
        default: 0,
    },
    clicks: {
        type: [
            {
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                ip: {
                    type: String,
                    required: false, 
                },
                device: {
                    type: String, 
                    required: false, 
                },
                browser: {
                    type: String, 
                    required: false, 
                },
                country: {
                    type: String,
                    required: false, 
                },
                latitude: {
                    type: Number, 
                    required: false, 
                },
                longitude: {
                    type: Number, 
                    required: false, 
                },
                referrer: {
                    type: String, 
                    required: false, 
                },
            }
        ],
        default: [],
    },
    created_by: {
        type: String,
        required: true,
    },
}, {
    strict: false,
    timestamps: true,
    versionKey: false,
});

url_schema.index({ created_by: 1, url: 1 }, { unique: true });
const url = mongoose.model('url_shortner', url_schema);

export default url;

import url from '../../models/url.js'
import user from '../../models/user.js';

export async function userHome(req, res) {
    try {
        const userId = req.params.id;
        const registered_urls = await Url
            .find({ created_by: userId }, { _id: 1, url: 1, short_url: 1, clicks_count: 1 }) // Select specific fields
            .lean() 
            .exec();
        const user_profile = await user.findOne({ _id: userId }).lean();
        const total_registered_url = registered_urls.length;
        const total_url_visites = registered_urls.reduce((sum, doc) => sum + (doc.clicks_count || 0), 0);
        const responseData = {
            total_url_visites,
            total_registered_url,
            registered_urls: {
                _id: registered_urls.map(doc => doc._id), 
                url: registered_urls.map(doc => doc.url), 
                short_url: registered_urls.map(doc => doc.short_url), 
                clicks_count: registered_urls.map(doc => doc.clicks_count) 
            },
            user_profile
        };

        res.json(responseData);
    } catch (err) {
        console.error("Error fetching URL data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
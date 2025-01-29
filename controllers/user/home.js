import url from '../../models/url.js'
import user from '../../models/user.js';

export async function userHome(req, res) {
    try {
        const userId = req.params.id;  
        const registered_urls = await url.find({ created_by: userId }, 'url short_url clicks _id').exec();
        const user_profile = await user.findOne({ _id: userId });
        const total_registered_url = registered_urls.length;
        const total_url_visites = registered_urls.reduce((sum, doc) => sum + (doc.clicks?.length || 0), 0);
        res.json({
            total_url_visites: total_url_visites,
            total_registered_url: total_registered_url,
            registered_urls: registered_urls,
            user_profile: user_profile,
        });
    } catch (err) {
        console.error("Error fetching URL data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
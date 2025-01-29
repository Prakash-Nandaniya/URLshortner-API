import url from '../models/url.js';

export async function mainHome(req, res) {
    try {
        const registered_urls = await url.find({}, 'url short_url clicks').exec();
        const total_registered_url = registered_urls.length;
        const total_url_visits = registered_urls.reduce((sum, doc) => sum + (doc.clicks?.length || 0), 0);

        res.status(200).json({
            total_url_visits,
            total_registered_url,
        });
    } catch (err) {
        console.error("Error fetching URL data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

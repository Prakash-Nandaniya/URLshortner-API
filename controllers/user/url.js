import 'module-alias/register.js';
import url_model from "../../models/url.js";
import { nanoid } from "nanoid";
import axios from 'axios';
import useragent from 'useragent';

export async function generateURL(req, res) {
    const url = req.body.url;
    const shortid = nanoid(10);
    let new_url = `${req.protocol}://${req.get('host')}/${shortid}`;

    try {
        const userIp = req.ip;
        let clickData = {
            timestamp: new Date(),
            ip: userIp,
            latitude: null,
            longitude: null,
            country: null,
            region: null,
            city: null,
            isp: null,
            device: null,
            browser: "Unknown",
            referrer: req.get("Referer") || "Direct",
        };

        try {
            const geolocationResponse = await axios.get(`http://ip-api.com/json/${userIp}`);
            const { lat, lon, country, region, city, isp } = geolocationResponse.data;
            const { device, browser } = useragent.parse(req.get("User-Agent"));
            clickData = {
                ...clickData,
                latitude: lat,
                longitude: lon,
                country: country,
                region: region,
                city: city,
                isp: isp,
                device: device,
                browser: browser || "Unknown",
            };
        } catch (geolocationError) {
            console.error("Error fetching geolocation:", geolocationError);
        }

        const createdURL = await url_model.create({
            id: shortid,
            url: url,
            short_url: new_url,
            created_by: req._id,
            clicks: [clickData],
        });

        const response = {
            url: createdURL.url,
            short_url: createdURL.short_url,
            clicks: createdURL.clicks,
        };
        res.status(201).json(response);
    } catch (err) {
        if (err.code === 11000) {
            res.status(404).json({ message: "URL is already registered" });
        } else {
            console.error(err);
            res.status(500).json({ message: "An error occurred while generating URL" });
        }
    }
}

export async function redirectURL(req, res) {
    const url_id = req.params.id;
    try {
        const URLinfo = await url_model.findOne({ id: url_id });
        if (URLinfo) {
            const _id = URLinfo._id;

            const userIp = req.ip;
            let clickData = {
                timestamp: new Date(),
                ip: userIp,
                latitude: null,
                longitude: null,
                country: null,
                region: null,
                city: null,
                isp: null,
                device: null,
                browser: "Unknown",
                referrer: req.get("Referer") || "Direct",
            };

            try {
                const geolocationResponse = await axios.get(`http://ip-api.com/json/${userIp}`);
                const { lat, lon, country, region, city, isp } = geolocationResponse.data;
                const { device, browser } = useragent.parse(req.get("User-Agent"));
                clickData = {
                    ...clickData,
                    latitude: lat,
                    longitude: lon,
                    country: country,
                    region: region,
                    city: city,
                    isp: isp,
                    device: device,
                    browser: browser || "Unknown",
                };
            } catch (geolocationError) {
                console.error("Error fetching geolocation:", geolocationError);
            }

            URLinfo.clicks.push(clickData);
            const data = { clicks: URLinfo.clicks };
            await url_model.findByIdAndUpdate(_id, data);
            res.redirect(URLinfo.url);
        } else {
            res.status(404).send('URL not found!!');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Not able to fetch URL data, some error occurred!!');
    }
}

export async function URLinfo(req, res) {
    const url_id = req.params.id;
    try {
        const URLinfo = await url_model.findOne({ _id: url_id });
        if (URLinfo) {
            res.status(200).json({
                original_url: URLinfo.url,
                short_url: URLinfo.short_url,
                click_history: URLinfo.clicks,
            });
        } else {
            res.status(404).json({ error: "URL not found!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch URL data." });
    }
}

export async function deleteURL(req, res) {
    const url_id = req.params.id;
    try {
        const URLinfo = await url_model.findOneAndDelete({ _id: url_id });
        if (URLinfo) {
            const url_clicks = URLinfo.clicks.length;
            res.status(200).json(url_clicks);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (err) {
        console.error("Error deleting URL:", err);
        res.status(500).send('Unable to delete URL, an error occurred');
    }
}

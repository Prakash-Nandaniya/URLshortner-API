import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function logReqRes(req, res, next) {
    const date = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const ISTDate = date.toLocaleString('en-GB', options);

    const logMessage = `${ISTDate} - ${req.method} ${req.originalUrl}\n`; 

    try {
        const path = join(dirname(fileURLToPath(import.meta.url)), '../log.txt');
        await fs.appendFile(path, logMessage);
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
    next();
}

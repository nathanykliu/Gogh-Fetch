import fetch from 'node-fetch';

export default async function (req, res) {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        res.status(400).send('No image URL provided');
        return;
    }

    try {
        // fetch image headers first to check the size
        const headResponse = await fetch(imageUrl, { method: 'HEAD' });
        if (!headResponse.ok) {
            throw new Error(`Failed to fetch image headers: ${headResponse.statusText}`);
        }

        // check image size from the headers
        const contentLength = headResponse.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > 4.5 * 1024 * 1024) { // 4.5MB
            res.redirect(imageUrl);
            return;
        }

        // if size is within limits, proceed to fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        // determine the content type
        let contentType = 'image/jpg'; // default to jpg
        if (imageUrl.endsWith('.png')) {
            contentType = 'image/png';
        } else if (imageUrl.endsWith('.gif')) {
            contentType = 'image/gif';
        } else if (imageUrl.endsWith('.webp')) {
            contentType = 'image/webp';
        } else if (imageUrl.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
        }
        
        // send the image back
        res.setHeader('Content-Type', contentType);
        res.send(imageBuffer);
    } catch (error) {
        console.error(`Error fetching ${imageUrl}:`, error);
        res.status(500).send('Error fetching image');
    }
}

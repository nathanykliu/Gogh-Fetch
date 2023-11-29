import fetch from 'node-fetch';

export default async function (req, res) {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        res.status(400).send('No image URL provided');
        return;
    }

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        let contentType = 'image/jpg'; // default to jpg
        if (imageUrl.endsWith('.png')) {
            contentType = 'image/png';
        } else if (imageUrl.endsWith('.gif')) {
            contentType = 'image/gif';
        }

        res.setHeader('Content-Type', contentType);
        res.send(imageBuffer);
    } catch (error) {
        console.error(`Error fetching ${imageUrl}:`, error);
        res.status(500).send('Error fetching image');
    }
}


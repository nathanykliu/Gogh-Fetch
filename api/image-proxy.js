const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        res.status(400).send('No image URL provided');
        return;
    }

    try {
        const response = await fetch(imageUrl);
        const imageBuffer = await response.buffer();

        let contentType = 'image/jpg'; // default to jpg
        if (imageUrl.endsWith('.png')) {
            contentType = 'image/png';
        } else if (imageUrl.endsWith('.gif')) {
            contentType = 'image/gif';
        }

        res.setHeader('Content-Type', contentType);
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Error fetching image');
    }
};

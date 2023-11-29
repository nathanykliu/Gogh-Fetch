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

        res.setHeader('Content-Type', 'image/jpeg'); // Adjust as needed
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Error fetching image');
    }
};
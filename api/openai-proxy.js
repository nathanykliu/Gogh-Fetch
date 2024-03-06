const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.post('/get-artwork-info', async (req, res) => {
    const artworkId = req.body.artworkId; // Assuming you're sending the artwork ID in the request body
    const prompt = `Tell me more about the artwork with ID ${artworkId}`;

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer YOUR_API_KEY_HERE`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.7,
                max_tokens: 150,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            })
        });

        const data = await response.json();
        res.json(data.choices[0].text);
    } catch (error) {
        console.error("Error fetching information: ", error);
        res.status(500).send("An error occurred while fetching information.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
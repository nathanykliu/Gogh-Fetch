// Import fetch (assuming you are using node-fetch v3+ which supports ESM)
import fetch from 'node-fetch';

// This is the main function for your serverless endpoint
export default async function (req, res) {
    // Extracting artworkId from the request body
    const { artworkId } = req.body;
    const prompt = `Tell me more about the artwork with ID ${artworkId}`;

    try {
        // Making a request to the OpenAI API
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CHATGPT_API}`, // Ensure your API key is correctly set in Vercel's environment variables
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "text-davinci-003", // Or the model you intend to use
                prompt: prompt,
                temperature: 0.7,
                max_tokens: 150,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            })
        });

        if (!response.ok) {
            // Throwing an error if the OpenAI API did not respond with a successful status code
            throw new Error(`OpenAI API responded with ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // Sending the response back to the client
        res.status(200).json({text: data.choices[0].text});
    } catch (error) {
        console.error("Error fetching information: ", error);
        // Sending an error response back to the client
        res.status(500).send("An error occurred while fetching information.");
    }
}

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();  // Initialize dotenv to read environment variables

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
}

main();
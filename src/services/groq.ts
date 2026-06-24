import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function getGroqResponse(prompt: string): Promise<any> {

  const groqChoices = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  const content = groqChoices.choices[0].message.content;
  console.log("Groq Response:", content);

  return content;
}

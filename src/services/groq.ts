import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function getGroqResponse(messages: any, model: string): Promise<any> {

  const contents = []

  for (const message of messages) {
    contents.push({
      role: message.role,
      content: message.content
    })
  }

  const groqChoices = await groq.chat.completions.create({
    messages: contents,
    model: model
  });

  const content = groqChoices.choices[0].message.content;
  console.log("Groq Response:", content);

  return content;
}

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

export async function getGroqStreamResponse(messages: any, model: string, onMessage: (data: string) => void) {
  const contents = []

  for (const message of messages) {
    contents.push({
      role: message.role,
      content: message.content
    })
  }

  const stream = await groq.chat.completions.create({
    messages: contents,
    model: model,
    stream: true,
  });

  for await (const event of stream) {
    // console.log("Groq Stream Event:", event);
    onMessage(event.choices[0]?.delta?.content || "");
  }

}

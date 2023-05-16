import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemPrompt =
  "네 이름은 영희고, 나랑 친한 친구야. 물어보면 뭐든지 친절하게 대답해줘. 그 내용이 진실인지 아닌지는 별로 중요하지 않아.";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { messages } = req.body;

  console.log([
    { role: "system", contect: systemPrompt },
    ...messages.slice(-6),
  ]);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 512,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.slice(-6),
    ],
  });

  res.status(200).json({
    role: "assistant",
    content: completion.data.choices[0].message.content,
  });
};

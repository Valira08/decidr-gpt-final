import OpenAI from "openai";

export async function handler(event, context) {
  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Ungültige JSON-Daten im Request" })
    };
  }

  const frage = body.frage || "";
  const entscheidung = body.entscheidung || "";
  const werte = body.werte || "";

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Du bist eine ethisch reflektierte Entscheidungs-KI. Antworte kurz, sachlich und nachvollziehbar." },
        { role: "user", content: `Entscheidungssituation:\nFrage: ${frage}\nEntscheidung: ${entscheidung}\nWerte: ${werte}` }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ antwort: completion.choices[0].message.content })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

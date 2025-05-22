DECIDR GPT-App

📄 index.html  → Benutzeroberfläche (bereits eingefügt)
📂 .netlify/functions/gpt.js → GPT-Serverfunktion (jetzt korrigiert für kompatibles OpenAI SDK)
📦 package.json → Abhängigkeit für openai (bereits vorhanden)


// Datei: .netlify/functions/gpt.js
```js
const { OpenAI } = require("openai");

exports.handler = async function(event, context) {
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
};
```

// Datei: package.json
```json
{
  "name": "decidr-gpt-app",
  "version": "1.0.0",
  "dependencies": {
    "openai": "^4.0.0"
  }
}
```

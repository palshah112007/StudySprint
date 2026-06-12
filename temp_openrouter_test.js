const fs = require('fs');
const OpenAI = require('openai');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/^OPENROUTER_API_KEY=(.*)$/m);
if (!match) {
  console.error('NO KEY');
  process.exit(1);
}
const key = match[1].replace(/"/g, '').trim();
const client = new OpenAI({ apiKey: key, baseURL: 'https://openrouter.ai/api/v1' });
(async () => {
  try {
    const response = await client.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        { role: 'system', content: 'You are a test assistant.' },
        { role: 'user', content: 'Say hello.' }
      ],
      max_tokens: 20,
    });
    console.log('STATUS OK');
    console.log(JSON.stringify(response?.choices?.[0]?.message?.content).slice(0, 500));
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    if (err && err.response) {
      console.error('RESPONSE', err.response.status, err.response.data || err.response.text || 'no body');
    }
    process.exit(1);
  }
})();

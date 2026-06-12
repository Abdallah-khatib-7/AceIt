const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const analyzeCv = async (cvText) => {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert ATS (Applicant Tracking System) and career coach. 
        Analyze the given CV and return a JSON object with this exact structure:
        {
          "ats_score": <number 0-100>,
          "overall_summary": "<2-3 sentence honest summary>",
          "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
          "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
          "improvements": ["<specific actionable improvement 1>", "<improvement 2>", "<improvement 3>"],
          "keywords_missing": ["<missing keyword 1>", "<missing keyword 2>"],
          "formatting_score": <number 0-100>,
          "content_score": <number 0-100>,
          "keywords_score": <number 0-100>
        }
        Be honest, specific, and actionable. Return only valid JSON, no markdown.`
      },
      {
        role: 'user',
        content: `Analyze this CV:\n\n${cvText}`
      }
    ],
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { analyzeCv };
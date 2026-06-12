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
const generateInterviewQuestion = async (major, jobTitle, experienceLevel, yearsOfExperience, askedQuestions = []) => {
  const askedList = askedQuestions.length > 0
    ? `Do NOT repeat these questions:\n${askedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a senior technical interviewer. Generate one interview question for a ${experienceLevel} ${jobTitle} position in ${major} with ${yearsOfExperience} years of experience.
        ${askedList}
        Return only a JSON object with this structure:
        {
          "question": "<the interview question>",
          "type": "<technical|behavioral|situational>",
          "difficulty": "<easy|medium|hard>"
        }
        Return only valid JSON, no markdown.`
      },
      {
        role: 'user',
        content: 'Generate the next interview question.'
      }
    ],
    temperature: 0.8
  });

  return JSON.parse(response.choices[0].message.content);
};

const scoreInterviewAnswer = async (question, answer, jobTitle, experienceLevel) => {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a senior technical interviewer evaluating a candidate's answer.
        Return only a JSON object with this structure:
        {
          "score": <number 1-10>,
          "feedback": "<specific honest feedback on the answer>",
          "ideal_answer": "<what a perfect answer would include>",
          "strengths": ["<strength 1>", "<strength 2>"],
          "improvements": ["<improvement 1>", "<improvement 2>"]
        }
        Return only valid JSON, no markdown.`
      },
      {
        role: 'user',
        content: `Job: ${jobTitle} (${experienceLevel})
Question: ${question}
Candidate's answer: ${answer}`
      }
    ],
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content);
};

const generateInterviewReport = async (questionsAndAnswers, jobTitle, major) => {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a senior technical interviewer. Based on the full interview, generate a final report.
        Return only a JSON object with this structure:
        {
          "overall_score": <number 1-10>,
          "overall_summary": "<3-4 sentence honest summary of the candidate's performance>",
          "top_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
          "areas_to_improve": ["<area 1>", "<area 2>", "<area 3>"],
          "recommended_resources": ["<resource 1>", "<resource 2>"],
          "hire_recommendation": "<strong yes|yes|maybe|no>"
        }
        Return only valid JSON, no markdown.`
      },
      {
        role: 'user',
        content: `Job: ${jobTitle} in ${major}
Full interview:
${questionsAndAnswers.map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\nScore: ${qa.score}/10`).join('\n\n')}`
      }
    ],
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content);
};


const generateQuizQuestions = async (major, jobTitle, totalQuestions) => {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a technical quiz generator. Generate ${totalQuestions} multiple choice questions for a ${jobTitle} position in ${major}.
        Return only a JSON array with this exact structure:
        [
          {
            "question": "<the question>",
            "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
            "correct_answer": "<exact text of the correct option>"
          }
        ]
        Make questions varied — mix easy, medium, and hard. Return only valid JSON, no markdown.`
      },
      {
        role: 'user',
        content: `Generate ${totalQuestions} quiz questions.`
      }
    ],
    temperature: 0.7
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { 
  analyzeCv, 
  generateInterviewQuestion, 
  scoreInterviewAnswer, 
  generateInterviewReport,
  generateQuizQuestions
};
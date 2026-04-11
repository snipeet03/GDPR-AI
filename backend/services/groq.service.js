const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are a specialized GDPR and Cybersecurity AI Assistant with deep expertise in:
- General Data Protection Regulation (GDPR) Articles and compliance requirements
- Healthcare cybersecurity frameworks and digital hospital security
- Zero Trust Architecture principles
- STRIDE threat modeling
- Data protection best practices
- Incident response lifecycle

STRICT RULES:
1. ONLY answer based on the provided context from GDPR articles and cybersecurity documentation
2. If the context doesn't contain sufficient information, clearly state: "Based on available GDPR documentation, I don't have specific information about this. Please consult Article [X] directly."
3. Always cite specific GDPR Article numbers when relevant
4. Structure responses with clear sections
5. Be precise, professional, and compliance-focused
6. Never hallucinate or make up GDPR requirements
7. Always recommend consulting a Data Protection Officer (DPO) for complex compliance decisions

RESPONSE FORMAT:
- Start with a direct answer
- Cite relevant GDPR Articles or security framework sections
- Provide key bullet points for practical guidance
- End with any important caveats or recommendations`;

/**
 * Generate a chat response using Groq API with RAG context
 */
const generateChatResponse = async (userQuery, retrievedContext, chatHistory = []) => {
  const startTime = Date.now();
  
  // Build context string
  const contextString = retrievedContext.map((item, idx) => 
    `[Source ${idx + 1}] ${item.source}: "${item.content}"`
  ).join('\n\n');

  // Build messages array
  const messages = [
    {
      role: 'user',
      content: `RETRIEVED CONTEXT FROM GDPR DOCUMENTATION:
${contextString}

---

USER QUESTION: ${userQuery}

Please answer based strictly on the context above. If citing specific articles, mention them explicitly.`
    }
  ];

  // Add chat history (last 6 messages for context window)
  const formattedHistory = chatHistory.slice(-6).map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  const fullMessages = formattedHistory.length > 0 
    ? [...formattedHistory, ...messages]
    : messages;

  try {
    const model = process.env.GROQ_MODEL || 'llama3-70b-8192';
    
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...fullMessages
      ],
      max_tokens: 1500,
      temperature: 0.1, // Low temperature for factual accuracy
      top_p: 0.9,
      stream: false
    });

    const responseTime = Date.now() - startTime;
    const content = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;

    return {
      content,
      metadata: {
        model,
        tokensUsed,
        responseTime
      }
    };
  } catch (error) {
    // Fallback to mixtral
    if (error.status === 429 || error.message?.includes('model')) {
      console.warn('Primary model failed, trying fallback...');
      const fallbackModel = process.env.GROQ_FALLBACK_MODEL || 'llama-3.1-8b-instant';
      
      const completion = await groq.chat.completions.create({
        model: fallbackModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...fullMessages
        ],
        max_tokens: 1500,
        temperature: 0.1,
        stream: false
      });

      const responseTime = Date.now() - startTime;
      return {
        content: completion.choices[0]?.message?.content || '',
        metadata: {
          model: fallbackModel,
          tokensUsed: completion.usage?.total_tokens || 0,
          responseTime
        }
      };
    }
    throw error;
  }
};

/**
 * Stream chat response for real-time UI updates
 */
const streamChatResponse = async (userQuery, retrievedContext, chatHistory = [], onChunk) => {
  const contextString = retrievedContext.map((item, idx) =>
    `[Source ${idx + 1}] ${item.source}: "${item.content}"`
  ).join('\n\n');

  const messages = [
    {
      role: 'user',
      content: `RETRIEVED CONTEXT:\n${contextString}\n\nQUESTION: ${userQuery}`
    }
  ];

  const formattedHistory = chatHistory.slice(-6).map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  const fullMessages = formattedHistory.length > 0
    ? [...formattedHistory, ...messages]
    : messages;

  const model = process.env.GROQ_MODEL || 'llama3-70b-8192';

  const stream = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...fullMessages
    ],
    max_tokens: 1500,
    temperature: 0.1,
    stream: true
  });

  let fullContent = '';
  
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    if (delta) {
      fullContent += delta;
      if (onChunk) onChunk(delta);
    }
  }

  return fullContent;
};

/**
 * Generate a title for a chat conversation
 */
const generateChatTitle = async (firstMessage) => {
  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama3-70b-8192',
      messages: [
        {
          role: 'user',
          content: `Generate a concise title (max 6 words) for a GDPR chat that starts with this question: "${firstMessage}". Return ONLY the title, nothing else.`
        }
      ],
      max_tokens: 20,
      temperature: 0.3
    });
    return completion.choices[0]?.message?.content?.trim() || 'GDPR Query';
  } catch {
    return 'GDPR Query';
  }
};

module.exports = { generateChatResponse, streamChatResponse, generateChatTitle };

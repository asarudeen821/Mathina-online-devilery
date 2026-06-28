import chefService from '../utils/chefSLMService.js';

/**
 * Handles real-time cooking problem solving requests
 */
export const askChef = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: "The Chef needs to know your problem!" 
      });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await chefService.getStreamResponse(message, history || []);

    for await (const part of stream) {
      if (part.message && part.message.content) {
        res.write(`data: ${JSON.stringify({ content: part.message.content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Streaming Error:', error);
    res.status(500).json({
      success: false,
      message: "The kitchen is in chaos. Please try again." 
    });
  }
};

/**
 * Health check for the local SLM model
 */
export const getChefStatus = async (req, res) => {
  const isReady = await chefService.isChefReady();
  res.status(200).json({
    success: true,
    status: isReady ? 'Ready to cook' : 'Model loading...',
    model: chefService.model
  });
};
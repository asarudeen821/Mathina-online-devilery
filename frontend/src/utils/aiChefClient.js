/**
 * Client service to interact with the Real SLM Backend
 */
export const streamChefResponse = async (message, history, onChunk, onDone, onError, signal) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chef/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal: signal, // SaaS-level request interruption support
    });

    if (!response.ok) throw new Error('Chef is busy at the stove.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.replace('data: ', '').trim();
          
          if (dataStr === '[DONE]') {
            onDone(fullContent);
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.content) {
              fullContent += parsed.content;
              onChunk(fullContent);
            }
          } catch (e) { /* partial JSON */ }
        }
      }
    }
  } catch (error) {
    console.error('AI Bridge Error:', error);
    onError(error);
  }
};
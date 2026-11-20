import ollama from 'ollama';

/**
 * ChefSLMService - Specialized Small Language Model service for 
 * real-time culinary problem solving and recipe assistance.
 */
class ChefSLMService {
  constructor() {
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
    this.systemPrompt = `
      SYSTEM ROLE: Mathina FreshHub Culinary Intelligence Engine (SaaS-Model)
      DOMAIN: Poultry Science, Professional Butchery, and Indian Culinary Arts.
      TONE: Analytical, efficient, and professional. Use high-density information.

      CORE PROTOCOLS:
      1. DATA STRUCTURE: Use Markdown tables for metrics (prep time, cook time, calories).
      2. PROBLEM SOLVING: Use "IDENTIFIED ISSUE" -> "RESOLUTION STEPS" format for kitchen troubleshooting.
      3. SHOP INTEGRATION: Explicitly mention Mathina FreshHub premium cuts (Julienne, Butterfly, Dragon Cut).
      4. NAVIGATION: If a user needs to manage an order or cancel, direct them to the "My Orders" dashboard.

      SERVICE METADATA:
      - Enterprise Contact: +91 77080 32726 (Direct) / +91 80566 94908 (WhatsApp)
      - Digital Support: MathinaFreshHub@gmail.com
      - Location Hub: Cuddalore OT, Tamil Nadu.

      RULES:
      - Format recipes using Code Blocks for steps to ensure high visibility.
      - Always provide a "Pro-Tip" at the end of every interaction.
      - If a query is non-culinary, return: "QUERY OUT OF SCOPE. Please interface with the Culinary Intelligence module for poultry-related queries."
    `;
  }

  /**
   * Returns a streaming chat response for real-time interaction
   */
  async getStreamResponse(userMessage, history = []) {
    try {
      return await ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          ...history,
          { role: 'user', content: userMessage }
        ],
        stream: true,
        options: { temperature: 0.7 }
      });
    } catch (error) {
      console.error('Chef SLM Error:', error);
      throw error;
    }
  }

  async isChefReady() {
    try {
      const response = await ollama.list();
      return response.models.some(m => m.name.includes(this.model));
    } catch { return false; }
  }
}

export default new ChefSLMService();
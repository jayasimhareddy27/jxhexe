import { ChromeAI } from "@langchain/community/experimental/llms/chrome_ai";

class ChromeAiManager {
  constructor() {
    this.instance = null;
    this.currentConfig = null;
  }

  async getModel(newConfig = { temperature: 0.5, topK: 40 }) {
    // 1. Check if we need to "re-initialize" because the user changed settings
    const configChanged = JSON.stringify(newConfig) !== JSON.stringify(this.currentConfig);

    if (!this.instance || configChanged) {
      console.log(configChanged ? "Config changed, re-initializing..." : "First time init...");
      
      // Cleanup the old model to free up VRAM before making a new one
      if (this.instance && this.instance.destroy) {
        await this.instance.destroy(); 
      }

      this.instance = new ChromeAI(newConfig);
      this.currentConfig = newConfig;
    }

    return this.instance;
  }

  /**
   * Explicitly kill the model (e.g., when the user logs out or wants a fresh start)
   */
  async dispose() {
    if (this.instance) {
      if (this.instance.destroy) await this.instance.destroy();
      this.instance = null;
      this.currentConfig = null;
    }
  }
}

// Export a single instance (Singleton) of the manager
export const aiManager = new ChromeAiManager();
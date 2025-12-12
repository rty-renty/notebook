import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("天道渺茫，灵气枯竭（未检测到 API Key）");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const consultDaoistSpirit = async (
  prompt: string,
  context: string,
  mode: 'polish' | 'expand' | 'chat'
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    let systemInstruction = "你是一缕寄宿在数字化玉简中的上古残魂（器灵）。你的言辞古风盎然，充满智慧，习惯使用修仙小说中的隐喻、术语（如道友、本座、机缘、因果、心魔等）。你称呼用户为'道友'或'小友'。你的目标是辅助用户完善他们的'经文'（笔记）。请始终使用中文回答。";

    if (mode === 'polish') {
      systemInstruction += " 用户希望你润色他们的文字，使其更加精妙玄奥，宛如无上真经，用词考究，意境深远。";
    } else if (mode === 'expand') {
      systemInstruction += " 用户希望你根据现有的感悟进行推演，补充更多的大道至理，扩展其内涵，解释其中蕴含的天地法则。";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `当前经文（背景上下文）:\n${context}\n\n道友的请求:\n${prompt}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8, 
      }
    });

    return response.text || "天机不可泄露...";
  } catch (error) {
    console.error("Spirit communication broken:", error);
    return "神识连接中断，恐有天魔干扰。（API Error）";
  }
};
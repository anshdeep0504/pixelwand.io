
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Portfolio, ChatMessage } from '../types';
import { GoogleGenAI, Chat } from '@google/genai';
import { Card } from './ui/Card';
import { GEMINI_API_KEY } from '../config';

const SendIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const BotIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>);
const UserIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

const getMockResponse = (input: string, portfolio: Portfolio): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('how many') || lowerInput.includes('holdings') || lowerInput.includes('stocks')) {
        const holdingsList = portfolio.holdings.map(h => `- ${h.quantity} shares of ${h.ticker}`).join('\n');
        return `You have the following holdings:\n${holdingsList}\n\nFor deeper analysis, please configure the Gemini API key.`;
    }

    if (lowerInput.includes('value') || lowerInput.includes('worth')) {
        const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio.totalValue);
        return `Your total portfolio value is ${formattedValue}.\n\nFor more detailed questions, please configure the Gemini API key.`;
    }

    if (lowerInput.includes('cash')) {
        const formattedCash = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio.cash);
        return `You have ${formattedCash} in cash.\n\nFor more detailed questions, please configure the Gemini API key.`;
    }

    if (lowerInput.includes('thesis')) {
        return `Here is the AI-generated investment thesis:\n\n"${portfolio.aiInsights.investmentThesis}"\n\nTo ask follow-up questions, please configure the Gemini API key.`;
    }
    
    if (lowerInput.includes('summary')) {
        return `Here is the AI-generated summary:\n\n"${portfolio.aiInsights.summary}"\n\nTo ask follow-up questions, please configure the Gemini API key.`;
    }

    return "I can answer basic questions about your holdings, total value, and cash. For more advanced conversations and analysis, please configure the Google Gemini API key in the `config.ts` file.";
};


const Chatbot: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = useCallback(() => {
    if (!GEMINI_API_KEY) {
        setIsConfigured(false);
        setMessages([{ role: 'model', content: "Hello! I can answer basic questions about your portfolio's holdings, value, and cash.\n\nTo enable live AI chat for deeper insights, please add your Google Gemini API key to `config.ts`." }]);
        return;
    }

    try {
      setIsConfigured(true);
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY as string });
      
      const holdingsString = portfolio.holdings.map(h => `${h.quantity} shares of ${h.ticker} (${h.companyName}) at $${h.price.toFixed(2)} each`).join(', ');
      const systemInstruction = `You are a helpful portfolio assistant for ValueMetrix. Analyze the provided portfolio and offer actionable, educational, or general investment advice based on the data. You may comment on diversification, risk, sector exposure, and suggest improvements, but do not give personalized or regulated financial advice. ALWAYS answer in a single, concise sentence (one-liner) for every user question, no matter how complex.\n\nHere is the portfolio data:\n- Total Value: $${portfolio.totalValue.toFixed(2)}\n- Cash Balance: $${portfolio.cash.toFixed(2)}\n- Holdings: ${holdingsString}\n- AI-Generated Thesis: ${portfolio.aiInsights.investmentThesis}\n- AI-Generated Summary: ${portfolio.aiInsights.summary}\n\nAnswer questions based ONLY on this context.`;

      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
        },
      });

      setMessages([{ role: 'model', content: "Hello! I'm your portfolio assistant. Ask me anything about the assets, value, or AI insights for this portfolio." }]);
    } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages([{ role: 'model', content: "Sorry, I couldn't connect to the AI assistant right now." }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    if (!isConfigured || !chatRef.current) {
        setTimeout(() => {
            const mockResponseContent = getMockResponse(currentInput, portfolio);
            const mockMessage: ChatMessage = { role: 'model', content: mockResponseContent };
            setMessages(prev => [...prev, mockMessage]);
            setIsLoading(false);
        }, 1000);
        return;
    }

    try {
      const result = await chatRef.current.sendMessageStream({ message: input });
      
      let modelResponse = '';
      setMessages(prev => [...prev, {role: 'model', content: ''}]);

      for await (const chunk of result) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = modelResponse;
            return newMessages;
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]); // remove placeholder and add error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-brand-border flex items-center gap-3">
            <BotIcon className="w-6 h-6 text-brand-accent"/>
            <h3 className="text-lg font-semibold text-brand-text">Portfolio AI Chat</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && <BotIcon className="w-6 h-6 text-brand-text-secondary flex-shrink-0 mt-1"/>}
                    <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-brand-secondary'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && <UserIcon className="w-6 h-6 text-brand-text-secondary flex-shrink-0 mt-1"/>}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3">
                    <BotIcon className="w-6 h-6 text-brand-text-secondary flex-shrink-0 mt-1"/>
                    <div className="rounded-lg px-4 py-2 max-w-sm bg-brand-secondary">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-brand-accent rounded-full animate-bounce"></span>
                           <span className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                           <span className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-brand-border">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your portfolio..."
                    className="flex-1 bg-brand-primary border border-brand-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    disabled={isLoading}
                />
                <button type="submit" className="p-2 bg-brand-accent hover:bg-brand-accent-hover rounded-lg text-white disabled:bg-brand-text-secondary" disabled={isLoading || !input.trim()}>
                    <SendIcon className="w-5 h-5"/>
                </button>
            </form>
        </div>
    </Card>
  );
};

export default Chatbot;

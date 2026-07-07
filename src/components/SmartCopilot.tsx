import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Bot, User, RefreshCw, AlertTriangle, MessageSquareCode } from "lucide-react";
import { CopilotMessage, Product, StoreBranch } from "../types";

interface SmartCopilotProps {
  currentRole: string;
  currentBranch: StoreBranch | null;
  products: Product[];
  onApplyAction?: (actionType: string, payload: any) => void;
}

export default function SmartCopilot({ currentRole, currentBranch, products, onApplyAction }: SmartCopilotProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "init",
      sender: "copilot",
      text: `👋 **Hello! I am your ExpertAid Smart Billing Co-pilot.**\n\nI can help you analyze inventory, suggest promotional coupon wording, construct quick product bundles, or solve expiring shelf-life items. \n\n*How can I assist you as **${currentRole}** today?*`,
      suggestions: [
        "Check expiring shelf-life items",
        "Generate a discount code strategy",
        "Create an SMS promo for near-expiry milk",
        "How should I optimize the butter inventory?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest reply
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Compute nearby expiring items & low stock items for context
  const getInventoryContext = () => {
    const lowStock = products.filter((p) => p.stock <= p.minStockAlert);
    const expiringSoon = products.filter((p) => {
      const expDate = new Date(p.expiryDate);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 14; // expiring in 14 days
    });

    return {
      lowStockProducts: lowStock.map(p => ({ name: p.name, stock: p.stock, minAlert: p.minStockAlert })),
      expiringProducts: expiringSoon.map(p => ({ name: p.name, expiry: p.expiryDate, stock: p.stock })),
      currentRole,
      currentBranch
    };
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          context: getInventoryContext()
        })
      });

      const data = await response.json();
      
      const copilotMessage: CopilotMessage = {
        id: `msg-copilot-${Date.now()}`,
        sender: "copilot",
        text: data.text,
        suggestions: data.suggestions
      };

      setMessages((prev) => [...prev, copilotMessage]);
    } catch (e) {
      const errorMessage: CopilotMessage = {
        id: `msg-err-${Date.now()}`,
        sender: "copilot",
        text: "⚠️ **Connection Error**: Unable to contact the AI co-pilot backend. Please try again. Your server might be starting up.",
        suggestions: ["Re-test copilot server"]
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden" id="smart-copilot">
      {/* Header */}
      <div className="p-4 bg-slate-100 border-b border-slate-200/80 text-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Smart Node
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm tracking-tight text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              ExpertAid Billing AI
            </h3>
            <p className="text-[10px] text-slate-500 font-sans tracking-wide">
              Context: Supermarket Operations & Analytics
            </p>
          </div>
        </div>
        <Bot className="w-5 h-5 opacity-90 text-emerald-600" />
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[90%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                msg.sender === "user"
                  ? "bg-slate-100 border-slate-200 text-slate-700 font-bold text-xs"
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}
            >
              {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2">
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-slate-100 text-slate-800 border border-slate-200 rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                }`}
              >
                {/* Parse Markdown-like lists & bold simply */}
                {msg.text.split("\n").map((line, i) => {
                  if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                    return (
                      <li key={i} className="ml-4 list-disc mt-1">
                        {parseFormattedText(line.trim().substring(1).trim())}
                      </li>
                    );
                  }
                  return (
                    <p key={i} className={line.trim() ? "mt-1.5 first:mt-0" : "h-2"}>
                      {parseFormattedText(line)}
                    </p>
                  );
                })}
              </div>

              {/* Action Prompt Suggestion Buttons */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-1">
                  {msg.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug)}
                      disabled={loading}
                      className="px-2.5 py-1 text-[10px] rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200 text-left active:bg-emerald-200 transition-colors cursor-pointer font-sans"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span className="text-xs text-slate-500 font-mono tracking-tight">AI Co-pilot is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 bg-white border-t border-slate-200 flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask the Smart retail co-pilot...`}
          disabled={loading}
          className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 placeholder-slate-400 font-sans"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="p-2 rounded-lg bg-slate-100 text-emerald-700 hover:bg-slate-200 border border-slate-200/60 disabled:opacity-40 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

// Simple bold string parser to style **words**
function parseFormattedText(txt: string) {
  const parts = txt.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900 border-b border-dashed border-emerald-500/20">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

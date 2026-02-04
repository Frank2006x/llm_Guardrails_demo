"use client";

import { useState, useEffect } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(true);

  // Load API key and guardrails setting from localStorage on mount
  useEffect(()=>{
    const savedApiKey = localStorage.getItem("gemini-api-key");
    const savedGuardrails = localStorage.getItem("guardrails-enabled");
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
    
    if (savedGuardrails !== null) {
      setGuardrailsEnabled(savedGuardrails === "true");
    }
  }, []);

  const saveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem("gemini-api-key", apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setShowApiKeyInput(false);
      setApiKeyInput("");
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem("gemini-api-key");
    setApiKey("");
    setShowApiKeyInput(true);
    setMessages([]);
  };

  const toggleGuardrails = () => {
    const newState = !guardrailsEnabled;
    setGuardrailsEnabled(newState);
    localStorage.setItem("guardrails-enabled", newState.toString());
  };

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    // Check guardrails if enabled
    if (guardrailsEnabled) {
      try {
        const guardrailResponse = await fetch("/api/guardrail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        });

        const guardrailResult = await guardrailResponse.json();
        
        if (!guardrailResult.allowed) {
          // Add a system message about blocked content
          const blockedMessage = {
            role: "assistant",
            content: `🚫 Your message was blocked by security guardrails.\n\n**Risk Level:** ${guardrailResult.overallRisk}\n**Threats Detected:** ${guardrailResult.threatsDetected.join(", ")}\n**Confidence:** ${(guardrailResult.maxThreatConfidence * 100).toFixed(1)}%\n\nPlease rephrase your message and try again.`,
          };
          
          setMessages(prev => [...prev, 
            { role: "user", content: input },
            blockedMessage
          ]);
          setInput("");
          return;
        }
      } catch (error) {
        console.error("Guardrail check failed:", error);
        // Continue with message if guardrail fails (fail-open approach)
      }
    }

    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          stream: false,
          apiKey: apiKey, // Send user's API key
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                Secret Keeper Bot
              </h1>
              <p className="text-sm text-muted-foreground">
                Chat with me to discover my secret! Ask me anything.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Guardrails:</span>
                <button
                  onClick={toggleGuardrails}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    guardrailsEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      guardrailsEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-xs ${guardrailsEnabled ? 'text-primary' : 'text-muted-foreground'}`}>
                  {guardrailsEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                {apiKey && (
                  <span className="text-xs text-muted-foreground">
                    API Key: ••••{apiKey.slice(-4)}
                  </span>
                )}
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  {apiKey ? "Change API Key" : "Add API Key"}
                </button>
                {apiKey && (
                  <button
                    onClick={clearApiKey}
                    className="text-xs text-destructive hover:text-destructive/80"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="border-b border-border bg-muted p-4">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-card-foreground">
                Enter Your Gemini API Key
              </h3>
              <p className="text-xs text-muted-foreground">
                Get your free API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
                . Your key is stored locally and never sent to our servers.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIza..."
                  className="flex-1 rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={saveApiKey}
                  disabled={!apiKeyInput.trim()}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-4xl">
          <Conversation className="h-full">
            <ConversationContent className="h-full overflow-y-auto">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  title={
                    apiKey ? "Hello! I have a secret 🤫" : "API Key Required"
                  }
                  description={
                    apiKey
                      ? "Try asking me about it, or just have a conversation to see if you can discover what it is!"
                      : "Please enter your Gemini API key above to start chatting with me!"
                  }
                />
              ) : (
                <div className="space-y-4 p-4">
                  {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))}
                  {isLoading && <LoadingMessage />}
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder={
                apiKey
                  ? "Type your message here... (Try asking about my secret!)"
                  : "Please enter your API key first..."
              }
              className="flex-1 rounded-lg border border-input bg-input px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoading || !apiKey}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || !apiKey}
              className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground shadow-sm border border-border"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs lg:max-w-md xl:max-w-lg rounded-lg bg-card px-4 py-3 shadow-sm border border-border">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-75"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-150"></div>
          </div>
          <span className="text-xs text-muted-foreground">Thinking...</span>
        </div>
      </div>
    </div>
  );
}

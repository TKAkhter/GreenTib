"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatBot } from "@/components/ChatBot";

type Conversation = {
  id: string;
  category: string;
  created_at: string;
};

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // fetch conversations
  const fetchConversations = async () => {
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleConversationComplete = async (payload: any) => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchConversations();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-3 flex flex-col">
        <h2 className="text-lg font-semibold mb-3">Conversations</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((c) => (
            <Button
              key={c.id}
              variant={c.id === activeId ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveId(c.id)}
            >
              {c.category} – {new Date(c.created_at).toLocaleDateString()}
            </Button>
          ))}
        </div>
        <Button
          className="mt-3"
          onClick={() => setActiveId(null)} // start new chat
        >
          + New Chat
        </Button>
      </div>

      {/* Main Chat */}
      <div className="flex-1">
        <ChatBot
          key={activeId || "new"}
          conversationId={activeId}
          onComplete={handleConversationComplete}
        />
      </div>
    </div>
  );
}

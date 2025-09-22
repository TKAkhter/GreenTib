"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatBot } from "@/components/ChatBot";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Conversations, getConversationsUserByUserId } from "@/generated";
import logger from "@/common/pino";
import { toast } from "sonner";

export default function ChatLayout() {
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = useSelector((state: RootState) => state.user.id);

  const fetchConversations = async () => {

    setLoading(true);
    // const loadingToast = toast.loading("Loading Conversations...");

    try {
      const { data: conversationsResponse, error } = await getConversationsUserByUserId({
        path: {
          userId
        }
      });
      if (!conversationsResponse?.success) {
        throw error;
      }

      setConversations(conversationsResponse?.data!);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(error.message);
      toast.error(`Fetch conversations failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-3 flex flex-col">
        <h2 className="text-lg font-semibold mb-3">Conversations</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((c) => (
            <Button
              key={c.id}
              variant={c.id === activeId ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveId(c.id)}
            >
              {c.category} – {new Date(c.createdAt).toLocaleDateString()}
            </Button>
          ))}
        </div>
        {/* <Button className="mt-3" onClick={() => setActiveId(null)}>
          + New Chat
        </Button> */}
      </aside>

      {/* Main Chat */}
      <main className="flex-1">
        <ChatBot
          key={activeId || "new"}
          conversationId={activeId}
          onComplete={fetchConversations}
        />
      </main>
    </div>
  );
}

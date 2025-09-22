"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Conversations, getConversationsById, postConversations, putConversationsById } from "@/generated";
import { toast } from "sonner";

// Typing effect: renders one bubble at a time
const TypingBubble = ({ content, onDone }: { content: string; onDone?: () => void }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
            if (onDone) onDone();
        }, 600); // short typing delay per bubble
        return () => clearTimeout(timer);
    }, []);

    if (!visible) {
        return (
            <motion.div
                className="max-w-sm p-3 bg-gray-200 rounded-lg self-start"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
            >
                Typing…
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl p-4 bg-gray-200 rounded-lg self-start whitespace-pre-line"
        >
            {content}
        </motion.div>
    );
};

export const ChatBot = ({
    conversationId,
    onComplete,
}: {
    conversationId: string | null;
    onComplete: () => void;
}) => {
    const [conversation, setConversation] = useState<Conversations | null>(null);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [extraInput, setExtraInput] = useState("");
    const [typingQueue, setTypingQueue] = useState<string[]>([]);
    const [showFollowUp, setShowFollowUp] = useState(false);

    // fetch conversation if exists
    useEffect(() => {
        if (conversationId) {
            (async () => {
                try {
                    const { data, error } = await getConversationsById({ path: { id: conversationId } });
                    if (!data?.success) throw error;
                    if (data.data) {
                        setConversation(data.data);
                        setMessages(data.data?.messages || []);
                    }
                } catch (err: any) {
                    toast.error("Failed to load conversation");
                }
            })();
        } else {
            // fresh start
            const intro = { role: "assistant", content: "👋 Hi! Let’s get started with your report." };
            setMessages([intro]);
            setTypingQueue([intro.content]);
        }
    }, [conversationId]);

    // process typing queue one bubble at a time
    useEffect(() => {
        if (typingQueue.length === 0) return;
        const [next, ...rest] = typingQueue;
        const timer = setTimeout(() => {
            setTypingQueue(rest);
            setShowFollowUp(rest.length === 0); // show follow-up after last bubble
        }, 1200); // delay per bubble
        return () => clearTimeout(timer);
    }, [typingQueue]);

    const handleSend = async () => {
        if (!extraInput.trim()) return;
        const newMsg = { role: "user", content: extraInput };

        // optimistic update
        setMessages((prev) => [...prev, newMsg]);
        setExtraInput("");

        // if (conversationId) {
        //     await putConversationsById({
        //         path: { id: conversationId },
        //         body: newMsg,
        //     });
        // }

        // simulate assistant reply
        const reply = { role: "assistant", content: "✅ Noted! I’ve added that to your report." };
        setMessages((prev) => [...prev, reply]);
        setTypingQueue([reply.content]);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, i) =>
                    m.role === "assistant" ? (
                        <TypingBubble key={i} content={m.content} />
                    ) : (
                        <div
                            key={i}
                            className="p-3 bg-green-100 rounded-lg max-w-xl ml-auto"
                        >
                            {m.content}
                        </div>
                    )
                )}
                {/* Show pending typing bubbles */}
                {typingQueue.length > 0 && <TypingBubble content={typingQueue[0]} />}
                {showFollowUp && (
                    <TypingBubble content="Would you like to add anything else?" />
                )}
            </div>

            {/* Input bar */}
            <div className="p-4 border-t flex items-center gap-2">
                <Input
                    placeholder="Type your answer..."
                    value={extraInput}
                    onChange={(e) => setExtraInput(e.target.value)}
                />
                <Button onClick={handleSend}>Send</Button>
            </div>
        </div>
    );
};

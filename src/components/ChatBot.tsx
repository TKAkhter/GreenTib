"use client";

import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import { addNote, resetReport } from "@/redux/slices/reportSlice";

export const ChatBot = ({
    key,
    conversationId,
    onComplete,
}: {
    key: string,
    conversationId: string | null,
    onComplete: (payload: any) => void,
}) => {
    const dispatch = useDispatch();
    const { category, answers, notes } = useSelector(
        (state: RootState) => state.report
    );

    const [extraInput, setExtraInput] = useState("");
    const [typedReport, setTypedReport] = useState(""); // typing effect
    const [showFollowUp, setShowFollowUp] = useState(false);

    if (!category) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">No report available. Please start again.</p>
            </div>
        );
    }

    // Generate the plain text version of report
    const plainReport = [
        `Here’s your initial report:`,
        `Category: ${category}`,
        ...Object.entries(answers).map(([q, a]) => `${q}: ${a}`),
        ...(notes.length > 0
            ? [`Extra Notes:`, ...notes.map((note) => `- ${note}`)]
            : []),
    ].join("\n");

    // Typing effect for report
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < plainReport.length) {
                setTypedReport((prev) => prev + plainReport[index]);
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => setShowFollowUp(true), 800); // show next bubble after short delay
            }
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const handleAdd = () => {
        if (!extraInput.trim()) return;
        dispatch(addNote(extraInput));
        setExtraInput("");
    };

    const handleDone = () => {
        console.log("Final Report:", { category, answers, notes });
        dispatch(resetReport());
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* AI bubble with typing effect */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl p-4 bg-gray-200 rounded-lg self-start whitespace-pre-line"
                >
                    {typedReport}
                </motion.div>

                {/* Follow-up AI bubble */}
                {showFollowUp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl p-4 bg-gray-200 rounded-lg self-start"
                    >
                        Does this look good, or would you like to add something before we
                        start?
                    </motion.div>
                )}
            </div>

            {/* Input bar like ChatGPT */}
            <div className="p-4 border-t flex items-center gap-2">
                <Input
                    placeholder="Add extra notes..."
                    value={extraInput}
                    onChange={(e) => setExtraInput(e.target.value)}
                />
                <Button onClick={handleAdd}>Send</Button>
                <Button variant="secondary" onClick={handleDone}>
                    I’m Done
                </Button>
            </div>
        </div>
    );
}

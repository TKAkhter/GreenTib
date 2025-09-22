"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { questionSets } from "@/constants/questionSets";
import { useDispatch, useSelector } from "react-redux";
import { postConversations } from "@/generated";
import { RootState } from "@/redux/store";
import { setReport, addNote } from "@/redux/slices/reportSlice";

export default function QuestionForm() {
    const navigate = useNavigate();
    const [category, setCategory] = useState<string | null>(null);
    const [step, setStep] = useState(0); // 0 = category, 1..n = questions, last = notes
    const [answers, setAnswers] = useState<any>({});
    const [customInput, setCustomInput] = useState("");
    const [notesInput, setNotesInput] = useState("");
    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.user.id);

    const categories = Object.keys(questionSets);
    const questions =
        category && questionSets[category as keyof typeof questionSets];
    const totalSteps = category && questions ? questions.length + 2 : 1;


    const handleSelect = (value: string, custom?: boolean) => {
        const currentQ = questions ? questions[step - 1].question : "";
        const selectedAnswer = custom ? customInput : value;

        setAnswers((prev: any) => ({
            ...prev,
            [currentQ]: selectedAnswer,
        }));
        setCustomInput("");
        setStep((s) => s + 1);
    };

    const handleSubmit = async () => {
        if (notesInput.trim()) {
            dispatch(addNote(notesInput));
        }

        dispatch(setReport({ category: category!, answers }));

        const plainReport = [
            `Here’s your initial report:`,
            `Category: ${category}`,
            ...Object.entries(answers).map(([q, a]) => `${q}: ${a}`),
            ...(notesInput.trim() ? [`Notes: ${notesInput}`] : []),
        ].join("\n");

        await postConversations({
            body: {
                userId,
                category: category!,
                answers,
                notes: notesInput.trim() ? { note: notesInput } : {},
                messages: [{ role: "assistant", content: plainReport }],
            },
        });

        navigate("/report");
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        } else {
            // reset to category selection
            setCategory(null);
            setAnswers({});
            setStep(0);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
            <Card className="w-full max-w-lg shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-center">
                        Herbal AI Prescriber
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {step === 0 ? (
                            <motion.div
                                key="category"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <p className="font-medium">What do you want to improve?</p>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((c) => (
                                        <Button
                                            key={c}
                                            variant="outline"
                                            onClick={() => {
                                                setCategory(c);
                                                setStep(1);
                                            }}
                                        >
                                            {c.charAt(0).toUpperCase() + c.slice(1)}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : questions && step <= questions.length ? (
                            <motion.div
                                key={`q-${step}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <p className="font-medium">
                                    {questions[step - 1].question} ({step}/{questions.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {questions[step - 1].options.map((opt) => (
                                        <Button
                                            key={opt}
                                            variant="outline"
                                            onClick={() => handleSelect(opt)}
                                        >
                                            {opt}
                                        </Button>
                                    ))}
                                    {/* Custom input */}
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            placeholder="Custom answer"
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            className="w-40"
                                        />
                                        <Button
                                            disabled={!customInput}
                                            onClick={() => handleSelect(customInput, true)}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                                <Button variant="ghost" onClick={handleBack}>
                                    ← Back
                                </Button>
                            </motion.div>
                        ) : (
                            // Notes step
                            <motion.div
                                key="notes"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <p className="font-medium">Anything else you'd like to add?</p>
                                <Textarea
                                    placeholder="Additional notes..."
                                    value={notesInput}
                                    onChange={(e) => setNotesInput(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={handleBack}>
                                        ← Back
                                    </Button>
                                    <Button onClick={handleSubmit}>Submit</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}

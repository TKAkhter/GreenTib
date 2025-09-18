"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { questionSets } from "@/constant/questionSets";

export default function HerbalForm() {
  const [category, setCategory] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [customInput, setCustomInput] = useState<string>("");

  const categories = Object.keys(questionSets);

  const handleSelect = (value: string, custom?: boolean) => {
    const currentSet = questionSets[category as keyof typeof questionSets];
    const currentQ = currentSet[step - 1].question;

    setAnswers((prev: any) => ({
      ...prev,
      [currentQ]: custom ? customInput : value,
    }));

    setCustomInput(""); // reset custom field
    setStep((s) => s + 1);
  };

  const restart = () => {
    setCategory(null);
    setStep(0);
    setAnswers({});
  };

  type Question = { question: string; options: string[] };
  const questions: Question[] =
    category ? (questionSets[category as keyof typeof questionSets] as Question[]) : [];
  const totalSteps = category ? questions.length + 1 : 0;

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
            {!category ? (
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
            ) : step <= questions!.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <p className="font-medium">
                  {questions![step - 1].question} ({step}/{totalSteps})
                </p>
                <div className="flex flex-wrap gap-2">
                  {questions![step - 1].options.map((opt: any) => (
                    <Button
                      key={opt}
                      variant="outline"
                      onClick={() => handleSelect(opt)}
                    >
                      {opt}
                    </Button>
                  ))}
                  {/* Custom option */}
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
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <p className="font-medium">Your Report:</p>
                <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify({ category, answers }, null, 2)}
                </pre>
                <Button onClick={restart}>Start Over</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

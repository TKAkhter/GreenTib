import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const categories = {
  Hair: ["Hair Loss", "Hair Strength", "Early Greying", "Dandruff"],
  Skin: ["Acne", "Glow", "Anti-aging", "Dryness", "Dark Spots"],
  Stamina: ["Fatigue", "Weakness", "Male Vitality", "Female Vitality"],
  Digestion: ["Gas", "Acidity", "Constipation", "Bloating"],
  Sleep: ["Insomnia", "Anxiety", "Relaxation"],
  Immunity: ["Cold/Flu", "General Immunity", "Recovery"],
  Joints: ["Pain", "Arthritis", "Flexibility"]
};

const personalQuestions = [
  { key: "age", label: "What is your age?", type: "input" },
  { key: "gender", label: "What is your gender?", type: "options", options: ["Male", "Female", "Other"] },
  { key: "medications", label: "Are you taking any medications?", type: "options", options: ["Yes", "No"] },
  { key: "pregnant", label: "Are you pregnant (if applicable)?", type: "options", options: ["Yes", "No", "N/A"] },
  { key: "allergies", label: "Do you have any known allergies?", type: "options", options: ["Yes", "No"] },
  { key: "duration", label: "How long have you had this issue?", type: "options", options: ["<1 month", "1-6 months", ">6 months"] }
];

const AiBot: React.FC = () => {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<keyof typeof categories | "">("");
  const [subGoal, setSubGoal] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customValue, setCustomValue] = useState("");
  const [customActive, setCustomActive] = useState(false);
  const [report, setReport] = useState<{ category: string; sub_goal: string; [key: string]: any } | null>(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));

  const handleSubmit = () => {
    const structuredReport = {
      category,
      sub_goal: subGoal,
      ...formData
    };
    setReport(structuredReport);
  };

  const handleOptionSelect = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setCustomActive(false);
    setCustomValue("");
    handleNext();
  };

  const handleCustomSubmit = (key: string) => {
    if (customValue.trim()) {
      setFormData({ ...formData, [key]: customValue.trim() });
      setCustomActive(false);
      setCustomValue("");
      handleNext();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-6">
          {!report && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Step 0 → Category */}
              {step === 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">What do you want to improve?</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(categories).map((cat) => (
                      <Button
                        key={cat}
                        onClick={() => {
                          setCategory(cat as keyof typeof categories);
                          handleNext();
                        }}
                        variant={category === cat ? "default" : "outline"}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 1 → SubGoal */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">What do you want to improve in {category}?</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {category && categories[category].map((sg) => (
                      <Button
                        key={sg}
                        onClick={() => {
                          setSubGoal(sg);
                          handleNext();
                        }}
                        variant={subGoal === sg ? "default" : "outline"}
                      >
                        {sg}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" onClick={handleBack}>Back</Button>
                  </div>
                </>
              )}

              {/* Step 2+ → Personal Questions */}
              {step >= 2 && step < personalQuestions.length + 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    {personalQuestions[step - 2].label}
                  </h2>
                  {personalQuestions[step - 2].type === "input" ? (
                    <>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={formData[personalQuestions[step - 2].key] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [personalQuestions[step - 2].key]: e.target.value
                          })
                        }
                      />
                      <div className="mt-4 flex gap-2">
                        <Button variant="secondary" onClick={handleBack}>Back</Button>
                        <Button onClick={handleNext}>Next</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {personalQuestions[step - 2]?.options?.map((opt) => (
                          <Button
                            key={opt}
                            onClick={() => handleOptionSelect(personalQuestions[step - 2].key, opt)}
                            variant={formData[personalQuestions[step - 2].key] === opt ? "default" : "outline"}
                          >
                            {opt}
                          </Button>
                        ))}
                        <Button
                          variant={customActive ? "default" : "outline"}
                          onClick={() => setCustomActive(true)}
                        >
                          Custom
                        </Button>
                      </div>
                      {customActive && (
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2"
                            placeholder="Enter custom value"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                          />
                          <Button onClick={() => handleCustomSubmit(personalQuestions[step - 2].key)}>OK</Button>
                        </div>
                      )}
                      <div className="mt-4 flex gap-2">
                        <Button variant="secondary" onClick={handleBack}>Back</Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Final step → Submit */}
              {step === personalQuestions.length + 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">All done!</h2>
                  <p className="text-gray-600 mb-4">Click below to generate your report.</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleBack}>Back</Button>
                    <Button onClick={handleSubmit}>Generate Report</Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {report && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-semibold mb-4">Generated Report</h2>
              <pre className="bg-gray-100 p-4 rounded-xl text-sm overflow-auto">
                {JSON.stringify(report, null, 2)}
              </pre>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AiBot;

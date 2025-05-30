import React, { useState } from "react";

type Option = {
  text: string;
};

type Question = {
  questionText: string;
  options: Option[];
  correctAnswerIndex: number;
};

const MockTestManagement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30); // in minutes
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      correctAnswerIndex: 0,
    },
  ]);

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex: number, value: number) => {
    const updated = [...questions];
    updated[qIndex].correctAnswerIndex = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      duration,
      questions,
    };

    try {
      const response = await fetch("/api/mock-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Mock test created successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setDuration(30);
        setQuestions([
          {
            questionText: "",
            options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
            correctAnswerIndex: 0,
          },
        ]);
      } else {
        const errorData = await response.json();
        alert(`Failed to create test: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Something went wrong while submitting the test.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Mock Test</h1>

      <input
        type="text"
        className="input mb-3 w-full border p-2 rounded"
        placeholder="Test Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="input mb-3 w-full border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        className="input mb-6 w-full border p-2 rounded"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      <h2 className="text-xl font-semibold mb-3">Questions</h2>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 border p-4 rounded bg-white shadow-sm">
          <input
            type="text"
            placeholder={`Question ${qIndex + 1}`}
            className="input w-full mb-3 border p-2 rounded"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />

          {q.options.map((opt, oIndex) => (
            <div key={oIndex} className="mb-2 flex items-center gap-2">
              <label className="w-6 text-right">{String.fromCharCode(65 + oIndex)}.</label>
              <input
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                className="input w-full border p-2 rounded"
                value={opt.text}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
              />
            </div>
          ))}

          <div className="mt-2">
            <label className="block mb-1 font-medium">Correct Answer</label>
            <select
              className="input w-full border p-2 rounded"
              value={q.correctAnswerIndex}
              onChange={(e) => handleCorrectAnswerChange(qIndex, Number(e.target.value))}
            >
              {q.options.map((_, oIndex) => (
                <option key={oIndex} value={oIndex}>
                  Option {String.fromCharCode(65 + oIndex)}
                </option>
              ))}
            </select>
          </div>

          {questions.length > 1 && (
            <button
              onClick={() => removeQuestion(qIndex)}
              className="mt-3 text-red-600 text-sm underline"
            >
              Remove Question
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
      >
        + Add Question
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Mock Test
      </button>
    </div>
  );
};

export default MockTestManagement;

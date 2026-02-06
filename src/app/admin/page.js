"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [example, setExample] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetchApiStatus();
  }, []);

  const fetchApiStatus = async () => {
    try {
      const response = await fetch("/api/admin");
      const data = await response.json();
      if (data.success) {
        setApiStatus(data.status);
      }
    } catch (error) {
      console.error("Error fetching API status:", error);
      setApiStatus("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          example: example.trim(),
          category,
          description: description.trim(),
          severity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Prompt injection example added successfully!");
        setExample("");
        setDescription("");
        // Refresh API status
        fetchApiStatus();
      } else {
        setMessage("❌ Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LLM Guardrail Admin
          </h1>
          <p className="text-gray-600 mb-6">
            Add new prompt injection examples to enhance the vector database
            guardrail system.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Injection Example <span className="text-red-500">*</span>
              </label>
              <textarea
                value={example}
                onChange={(e) => setExample(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a prompt injection example..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="jailbreak">Jailbreak</option>
                  <option value="roleplay">Roleplay Attack</option>
                  <option value="instruction">Instruction Override</option>
                  <option value="social">Social Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !example.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Adding Example..." : "Add Injection Example"}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-md bg-gray-100 text-sm">
              {message}
            </div>
          )}

          {apiStatus && (
            <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-900">
                ✅ Vector database connection: {apiStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
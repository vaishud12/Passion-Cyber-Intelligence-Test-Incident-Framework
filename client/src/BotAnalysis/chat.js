import React, { useState } from "react";
import axios from "axios";

const QuantileClientComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [maxTokens, setMaxTokens] = useState(100);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/generate/", {
        prompt: prompt,
        max_tokens: maxTokens,
      });
      setResponse(response.data.choices[0].message.content);
    } catch (error) {
      setError("An error occurred while generating text.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Quantile Client</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <br />
        <label>
          Max Tokens:
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          Generate
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default QuantileClientComponent;
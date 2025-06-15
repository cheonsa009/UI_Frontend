import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Study_Hours_per_Week: "",
    Sleep_Hours_per_Night: "",
    Attendance: "",
    Stress_Level: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      "Study_Hours_per_Week": parseFloat(formData.Study_Hours_per_Week),
      "Sleep_Hours_per_Night": parseFloat(formData.Sleep_Hours_per_Night),
      "Attendance (%)": parseFloat(formData.Attendance),
      "Stress_Level (1-10)": parseFloat(formData.Stress_Level)
    };

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Error connecting to the server.");
    }
  };

  return (
    <div className="App">
      <h1>🎓 Student Performance Predictor</h1>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label>Study Hours per Week</label>
          <input
            type="number"
            name="Study_Hours_per_Week"
            value={formData.Study_Hours_per_Week}
            onChange={handleChange}
            required
          />

          <label>Sleep Hours per Night</label>
          <input
            type="number"
            name="Sleep_Hours_per_Night"
            value={formData.Sleep_Hours_per_Night}
            onChange={handleChange}
            required
          />

          <label>Attendance (%)</label>
          <input
            type="number"
            name="Attendance"
            value={formData.Attendance}
            onChange={handleChange}
            required
          />

          <label>Stress Level (1-10)</label>
          <input
            type="number"
            name="Stress_Level"
            value={formData.Stress_Level}
            onChange={handleChange}
            required
          />

          <button type="submit">Predict</button>
        </form>

        {result && !result.error && (
          <div className="result">
            <h2>Prediction: {result.result.toUpperCase()}</h2>
            <p>Probability of Passing: {result.percentage}</p>
            <p>Confidence: {result.confidence}</p>
            <p>{result.interpretation}</p>
          </div>
        )}
      </div>

      {result && result.error && (
        <div className="error">
          <p>Error: {result.error}</p>
        </div>
      )}
    </div>
  );
}

export default App;

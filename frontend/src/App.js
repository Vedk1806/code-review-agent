import { useState } from "react";

function App() {
  const [prUrl, setPrUrl] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReview = async () => {
    if (!prUrl) return;
    setLoading(true);
    setReview(null);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pr_url: prUrl }),
      });
      const data = await response.json();
      setReview(data);
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0d1117",
      color: "#e6edf3",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", margin: "0", color: "#58a6ff" }}>
            🤖 Code Review Agent
          </h1>
          <p style={{ color: "#8b949e", marginTop: "8px" }}>
            Paste a GitHub PR URL and get an instant AI-powered code review
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "24px"
        }}>
          <label style={{ color: "#8b949e", fontSize: "14px" }}>
            GitHub Pull Request URL
          </label>
          <input
            type="text"
            placeholder="https://github.com/owner/repo/pull/1"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "15px",
              backgroundColor: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "8px",
              color: "#e6edf3",
              marginTop: "8px",
              marginBottom: "16px",
              boxSizing: "border-box",
              outline: "none"
            }}
          />
          <button
            onClick={handleReview}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              backgroundColor: loading ? "#238636aa" : "#238636",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "background 0.2s"
            }}
          >
            {loading ? "⏳ Reviewing..." : "🔍 Review PR"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#2d1f1f",
            border: "1px solid #f85149",
            borderRadius: "8px",
            color: "#f85149"
          }}>
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {review && (
          <div style={{ marginTop: "30px" }}>
            
            {/* PR Info Card */}
            <div style={{
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "20px"
            }}>
              <h2 style={{ margin: "0 0 16px 0", color: "#58a6ff" }}>
                📋 {review.title}
              </h2>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <span>👤 <strong>{review.author}</strong></span>
                <span>📁 Files: <strong>{review.files_changed}</strong></span>
                <span style={{ color: "#3fb950" }}>✅ +{review.additions}</span>
                <span style={{ color: "#f85149" }}>❌ -{review.deletions}</span>
                <span style={{
                  backgroundColor: review.state === "open" ? "#1f6feb" : "#8957e5",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  fontSize: "13px"
                }}>
                  {review.state}
                </span>
              </div>
            </div>

            {/* AI Review Card */}
            <div style={{
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "12px",
              padding: "24px"
            }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#58a6ff" }}>
                🔍 AI Review
              </h3>
              <pre style={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "8px",
                padding: "20px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#e6edf3",
                fontSize: "14px",
                lineHeight: "1.6",
                margin: "0"
              }}>
                {review.review}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
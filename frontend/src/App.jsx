import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalUrls, setTotalUrls] = useState(0);
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };
  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }
    if (!isValidUrl(url.trim())) {
      setError("Please enter a valid URL (e.g., https://example.com).");
      return;
    }
    setLoading(true);
    setError("");
    setShortUrl("");
    setShowEdit(false);

    const response = await fetch("http://127.0.0.1:5000/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.exists) {
      setShortUrl(`http://127.0.0.1:5000/${data.short_code}`);
      setError("This URL has already been shortened.");
    } else if (data.short_code) {
      setShortCode(data.short_code);
      setShowEdit(true);
    } else if (data.error) {
      setError(data.error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    const response = await fetch("http://127.0.0.1:5000/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, short_code: shortCode }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.error) {
      setError(data.error);
    } else if (data.short_code) {
      setShortUrl(`http://127.0.0.1:5000/${data.short_code}`);
      setShowEdit(false);
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/status")
      .then((res) => res.json())
      .then((data) => setTotalUrls(data.total_urls));
  }, [url, shortUrl]);

  return (
    <div id="root">
      <h1>URL Shortener</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading || showEdit}
      />
      {!showEdit ? (
        <button onClick={handleSubmit} disabled={loading || !url}>
          {loading ? "Shortening..." : "Shorten"}
        </button>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <label>Short Code:</label>
          <input
            type="text"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            disabled={loading}
            style={{ width: "150px", marginRight: "10px" }}
          />
          <button onClick={handleSave} disabled={loading || !shortCode}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {shortUrl && (
        <div className="shortened-url">
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
      <div style={{ marginBottom: "20px", color: "#555" }}>
        <strong>Status:</strong> {totalUrls} URLs have been shortened.
      </div>
    </div>
  );
}

export default App;

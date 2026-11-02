import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

export default function Summary({ fileUploaded }) {
  const [summaryText, setSummaryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (!fileUploaded) return;
    const imageURL = URL.createObjectURL(fileUploaded);
    setPreviewURL(imageURL);
    return () => URL.revokeObjectURL(imageURL);
  }, [fileUploaded]);
  useEffect(() => {
    async function getSummary() {
      if (!fileUploaded) return;
      setLoading(true);
      setError(null);
      try {
        const ai = new GoogleGenAI({
          apiKey: API_KEY,
        });
        // Convert the browser file object ot a base64 string
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(fileUploaded);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
        });

        // call ai.models.generateCOntent with model and contents
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: fileUploaded.type,
              },
            },
            "Summarize this document in 5-6 lines of paragraph, do not include markdown.",
          ],
        });
        setSummaryText(response.text);
      } catch (error) {
        setError("Something went wrong, please try again later!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getSummary();
  }, [fileUploaded]);

  return (
    <section className="summary">
      <h2>Preview of the Uploaded File</h2>
      <div className="image-preview">
        {previewURL &&
        fileUploaded.type &&
        fileUploaded.type.startsWith("image/") ? (
          <img src={previewURL} alt="Uploaded preview" />
        ) : (
          <embed
            src={previewURL}
            type="application/pdf"
            width="100%"
            height="600px"
          />
        )}
      </div>
      <h2>The summary of the file</h2>
      {loading && <div className="loader"></div>}
      {error && <div className="error">{error}</div>}
      {summaryText && (
        <div className="markdown-content">
          <p>{summaryText}</p>
        </div>
      )}
    </section>
  );
}

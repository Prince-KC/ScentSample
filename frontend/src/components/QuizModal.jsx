import React, { useState } from "react";

const QuizModal = ({ isOpen, onClose, onSelectCategory }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ vibe: "", occasion: "", intensity: "" });
  const [recommendation, setRecommendation] = useState(null);

  if (!isOpen) return null;

  const handleFinish = (finalIntensity) => {
    const updated = { ...answers, intensity: finalIntensity };
    setAnswers(updated);

    if (updated.vibe === "sweet-warm" || finalIntensity === "beast") {
      setRecommendation({
        category: "Middle Eastern",
        title: "Lattafa Khamrah Qahwa & 9 PM",
        reason: "You love warm, sweet gourmands and powerhouse longevity that turns heads in Kathmandu's cool weather.",
      });
    } else if (updated.occasion === "daily-versatile" || updated.vibe === "fresh-clean") {
      setRecommendation({
        category: "Designer",
        title: "Bleu de Chanel Parfum & Sauvage Elixir",
        reason: "You appreciate versatile sophistication, effortless compliments, and universally loved master perfumery.",
      });
    } else {
      setRecommendation({
        category: "Niche",
        title: "Baccarat Rouge 540 & Parfums de Marly Layton",
        reason: "You're a true connoisseur seeking unique, luxurious olfactory signatures that separate you from the crowd.",
      });
    }
    setStep(4);
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ vibe: "", occasion: "", intensity: "" });
    setRecommendation(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ padding: "36px", textAlign: "center" }}>
          {step === 1 && (
            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--gold-accent)", textTransform: "uppercase" }}>
                Step 1 of 3
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", margin: "10px 0 20px" }}>
                What scent profile calls to you?
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => { setAnswers({ ...answers, vibe: "sweet-warm" }); setStep(2); }}
                >
                  🍯 <strong>Rich, Sweet & Warm</strong> (Vanilla, Arabic Coffee, Cinnamon, Praline)
                </button>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => { setAnswers({ ...answers, vibe: "fresh-clean" }); setStep(2); }}
                >
                  🌊 <strong>Crisp, Fresh & Invigorating</strong> (Citrus, Oceanic notes, Green Apple)
                </button>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => { setAnswers({ ...answers, vibe: "dark-mysterious" }); setStep(2); }}
                >
                  🌲 <strong>Dark, Smoky & Woody</strong> (Oud, Birch Smoke, Ambergris, Cardamom)
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--gold-accent)", textTransform: "uppercase" }}>
                Step 2 of 3
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", margin: "10px 0 20px" }}>
                Where will you wear this perfume?
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => { setAnswers({ ...answers, occasion: "date-evening" }); setStep(3); }}
                >
                  ✨ <strong>Evening Dates & Special Events</strong>
                </button>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => { setAnswers({ ...answers, occasion: "daily-versatile" }); setStep(3); }}
                >
                  💼 <strong>Everyday College, Office & Casual Outings</strong>
                </button>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => { setAnswers({ ...answers, occasion: "club-party" }); setStep(3); }}
                >
                  🔥 <strong>Nightclubs, Parties & Gatherings</strong>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--gold-accent)", textTransform: "uppercase" }}>
                Step 3 of 3
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", margin: "10px 0 20px" }}>
                What projection strength do you prefer?
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => handleFinish("beast")}
                >
                  🚀 <strong>Beast-Mode (10+ hours projection)</strong>
                </button>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => handleFinish("balanced")}
                >
                  ⚖️ <strong>Balanced & Elegant (6 - 8 hours)</strong>
                </button>
                <button
                  className="size-pill"
                  style={{ padding: "14px", fontSize: "14px", textAlign: "left" }}
                  onClick={() => handleFinish("intimate")}
                >
                  🕯 <strong>Intimate Scent Bubble (Subtle & Seductive)</strong>
                </button>
              </div>
            </div>
          )}

          {step === 4 && recommendation && (
            <div>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>✨</div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--gold-accent)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Your Olfactory Match
              </span>
              <h3 style={{ fontSize: "24px", fontWeight: "900", textTransform: "uppercase", margin: "8px 0 12px" }}>
                {recommendation.category} Collection
              </h3>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "8px" }}>
                Suggested Decants: {recommendation.title}
              </p>
              <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6", marginBottom: "24px" }}>
                {recommendation.reason}
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button
                  className="btn-primary"
                  style={{ background: "#000", color: "#fff" }}
                  onClick={() => {
                    onSelectCategory(recommendation.category);
                    onClose();
                  }}
                >
                  Explore {recommendation.category} Samples
                </button>
                <button className="btn-secondary" style={{ color: "#000", borderColor: "#ccc" }} onClick={resetQuiz}>
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "StudySprint — Your Neural Study OS";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "#050507",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Left section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 80,
            flex: 1,
          }}
        >
          {/* Logo sparkle */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#7C3AED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              fontSize: 28,
            }}
          >
            ⚡
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "white",
              }}
            >
              StudySprint
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#A78BFA",
                marginTop: 8,
              }}
            >
              Your Neural Study OS
            </div>
          </div>

          {/* Feature tags */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
            }}
          >
            {["AI Quizzes", "Focus Timer", "Smart Flashcards"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 20,
                    border: "1px solid rgba(124,58,237,0.4)",
                    color: "#C4B5FD",
                    fontSize: 16,
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right section - Stats preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: 80,
            gap: 16,
            width: 300,
          }}
        >
          {/* Stat cards */}
          {[
            { label: "Focus Score", value: "94", color: "#7C3AED" },
            { label: "Total XP", value: "12,450", color: "#F59E0B" },
            { label: "Streak", value: "12 days", color: "#00D9F5" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px 20px",
                borderRadius: 12,
                background: "#0D0D11",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: stat.color,
                  marginTop: 4,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

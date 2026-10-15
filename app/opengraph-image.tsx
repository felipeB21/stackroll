import { ImageResponse } from "next/og";

export const alt = "Stackroll – Random Framework & Project Idea Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 120, fontWeight: 700 }}>Stackroll</div>
      <div style={{ fontSize: 40, opacity: 0.7, marginTop: 16 }}>
        Roll a framework. Build the idea.
      </div>
    </div>,
    size,
  );
}

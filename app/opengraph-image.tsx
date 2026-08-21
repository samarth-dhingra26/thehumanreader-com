import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0c",
          color: "#f2f0ea",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 30, color: "#8a8781", marginBottom: 24 }}>
          THE HUMAN READER
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
          Your essays need to be you.
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, color: "#d98e48" }}>
          Not AI.
        </div>
      </div>
    ),
    { ...size }
  );
}

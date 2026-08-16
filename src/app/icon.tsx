import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "linear-gradient(135deg, #3730A3 0%, #4338CA 50%, #4F46E5 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "8px",
          fontWeight: 900,
          fontFamily: "sans-serif",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}

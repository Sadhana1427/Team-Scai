import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: "linear-gradient(135deg, #3730A3 0%, #4338CA 50%, #4F46E5 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "36px",
          fontWeight: 900,
          fontFamily: "sans-serif",
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

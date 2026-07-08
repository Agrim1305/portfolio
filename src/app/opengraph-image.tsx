import { ImageResponse } from "next/og";

export const alt =
  "Agrim Sharma, Software Engineer and Applied AI, Adelaide University";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "hsl(60, 3%, 7%)",
          color: "hsl(40, 20%, 96%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "hsl(38, 70%, 62%)",
            fontFamily: "monospace",
          }}
        >
          Software · Applied AI · Adelaide
        </div>
        <div style={{ fontSize: 96, fontWeight: 500, marginTop: 28 }}>
          Agrim Sharma
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 24,
            color: "hsl(40, 9%, 78%)",
            fontFamily: "sans-serif",
            lineHeight: 1.4,
          }}
        >
          Final-year Computer Science student at Adelaide University. Builds and
          ships full-stack products.
        </div>
        <div
          style={{
            marginTop: 48,
            width: 120,
            height: 4,
            backgroundColor: "hsl(38, 70%, 62%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

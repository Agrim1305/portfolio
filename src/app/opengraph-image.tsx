import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Agrim Sharma, with Aris, his portfolio's AI assistant, drawn as an orange cloud";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The site's fonts as TrueType, which is all ImageResponse reads: Geist for
// the text, and the name's weight of Bricolage Grotesque, cut down to the
// letters of the name. The cloud is drawn with its face (cloud-face.svg).
export default async function Image() {
  const [geist, bricolage, cloud] = await Promise.all([
    readFile(join(process.cwd(), "src/app/geist-400.ttf")),
    readFile(join(process.cwd(), "src/app/bricolage-800.ttf")),
    readFile(join(process.cwd(), "src/app/cloud-face.svg"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 72px",
          backgroundColor: "#0F0F11",
          color: "#F1EFEA",
          fontFamily: "Geist",
          // The hero cloud's warm glow, behind where the cloud sits.
          backgroundImage: "radial-gradient(circle at 84% 46%, rgba(255,140,70,0.22), rgba(255,91,46,0) 32%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 24, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8C8984" }}>
            Software · Applied AI · Adelaide
          </div>
          <div
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 116,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              marginTop: 24,
            }}
          >
            Agrim Sharma
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.45, color: "#C9C6C0", marginTop: 32, maxWidth: 640 }}>
            Final-year Computer Science student at Adelaide University, majoring in Artificial Intelligence.
          </div>
          <div style={{ marginTop: 44, width: 120, height: 4, backgroundColor: "#FF5B2E" }} />
        </div>
        <img src={`data:image/svg+xml;base64,${cloud}`} width={280} height={280} alt="" />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist, weight: 400, style: "normal" },
        { name: "Bricolage Grotesque", data: bricolage, weight: 800, style: "normal" },
      ],
    },
  );
}

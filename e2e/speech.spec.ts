import { expect, test } from "@playwright/test";
import { forSpeech, takeSentences } from "../src/lib/speech";

test.describe("speech text", () => {
  test.skip(({ isMobile }) => isMobile, "pure logic, one run is enough");

  test("speaks whole sentences and holds back the rest", () => {
    expect(takeSentences("I built MetaPlay. It runs on Render and")).toEqual([
      ["I built MetaPlay."],
      "It runs on Render and",
    ]);
    // Decimals and domains have no space after the dot, so they stay whole.
    expect(takeSentences("My GPA is 5.35/7.0 at agrimsharma.com and")).toEqual([
      [],
      "My GPA is 5.35/7.0 at agrimsharma.com and",
    ]);
    expect(takeSentences("Three projects:\n- MetaPlay\n- Pathfinder\n")).toEqual([
      ["Three projects:", "- MetaPlay", "- Pathfinder"],
      "",
    ]);
  });

  test("drops links and list markers before speaking", () => {
    expect(forSpeech("- Source: https://github.com/Agrim1305/Metaplay.")).toBe("Source:");
    expect(forSpeech("Email me at agrimsh22@gmail.com")).toBe("Email me at agrimsh22@gmail.com");
  });
});

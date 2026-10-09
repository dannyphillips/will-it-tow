import fs from "fs";
import path from "path";
import manifest from "./manifest";
import { PWA_BACKGROUND_COLOR, PWA_THEME_COLOR } from "../lib/pwa-theme";

function pngSize(filePath: string) {
  const buf = fs.readFileSync(filePath);
  expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(buf.subarray(12, 16).toString("ascii")).toBe("IHDR");
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

describe("web app manifest", () => {
  const data = manifest();

  test("is a standalone app rooted at /", () => {
    expect(data.start_url).toBe("/");
    expect(data.scope).toBe("/");
    expect(data.display).toBe("standalone");
    expect(data.theme_color).toBe(PWA_THEME_COLOR);
    expect(data.background_color).toBe(PWA_BACKGROUND_COLOR);
    expect(data.name).toBe("Will It Tow");
    expect(data.short_name).toBe("Tow");
  });

  test("declares 192, 512, and a padded maskable 512 that exist at those sizes", () => {
    const icons = data.icons || [];
    expect(icons.map((icon) => `${icon.sizes}:${icon.purpose}`)).toEqual([
      "192x192:any",
      "512x512:any",
      "512x512:maskable",
    ]);

    for (const icon of icons) {
      const filePath = path.join(process.cwd(), "public", icon.src);
      expect(fs.existsSync(filePath)).toBe(true);
      const [width, height] = String(icon.sizes).split("x").map(Number);
      expect(pngSize(filePath)).toEqual({ width, height });
    }

    expect(pngSize(path.join(process.cwd(), "public/apple-touch-icon.png"))).toEqual({
      width: 180,
      height: 180,
    });
  });
});
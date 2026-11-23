// Team photos: assets-source/team/<id>.png -> public/team/<id>.webp (800x1000 portrait, 4:5) and
// public/team/<id>-avatar.webp (192x192, square crop on the face) and public/team/<id>-card.webp (240x300, small portrait). Sizes are merged into src/data/projectImageSizes.json.
// Run by hand: node scripts/build-team-photos.mjs
// Crop of the avatar per person: AVATAR_CROP = { left, top, size } in source pixels (check the result by eye).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const root = process.cwd();
const PEOPLE = {
  // head top ~y150, chin ~y640, face centre x~585. cardCrop (4:5): from just above the head to mid-chest, face in the upper third.
  "dawid-jaskiewicz": { avatarCrop: { left: 305, top: 120, size: 560 }, cardCrop: { left: 201, top: 100, width: 768, height: 960 } },
};
const sizesPath = path.join(root, "src/data/projectImageSizes.json");
const sizes = JSON.parse(fs.readFileSync(sizesPath, "utf8"));
fs.mkdirSync(path.join(root, "public/team"), { recursive: true });
for (const [id, { avatarCrop: c, cardCrop: k }] of Object.entries(PEOPLE)) {
  const src = path.join(root, "assets-source/team", `${id}.png`);
  const portrait = path.join(root, "public/team", `${id}.webp`);
  const avatar = path.join(root, "public/team", `${id}-avatar.webp`);
  const p = await sharp(src).resize(800, 1000, { fit: "cover", position: "top" }).webp({ quality: 80 }).toFile(portrait);
  const a = await sharp(src)
    .extract({ left: c.left, top: c.top, width: c.size, height: c.size })
    .resize(192, 192)
    .webp({ quality: 82 })
    .toFile(avatar);
  if (k) {
    const card = await sharp(src)
      .extract(k)
      .resize(240, 300)
      .webp({ quality: 82 })
      .toFile(path.join(root, "public/team", `${id}-card.webp`));
    sizes[`/team/${id}-card.webp`] = { width: card.width, height: card.height };
    console.log(`${id}: card ${card.width}x${card.height} ${(card.size / 1024).toFixed(0)} KB`);
  }
  sizes[`/team/${id}.webp`] = { width: p.width, height: p.height };
  sizes[`/team/${id}-avatar.webp`] = { width: a.width, height: a.height };
  console.log(`${id}: portrait ${p.width}x${p.height} ${(p.size / 1024).toFixed(0)} KB, avatar ${a.width}x${a.height} ${(a.size / 1024).toFixed(0)} KB`);
}
fs.writeFileSync(sizesPath, JSON.stringify(sizes, null, 2) + "\n");
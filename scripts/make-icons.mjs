// Renders the crescent icon to PNGs without extra dependencies.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const BG = [0x12, 0x10, 0x14];
const FG = [0xc9, 0xa2, 0x6b];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function render(size, scale) {
  const ss = 4;
  const rows = [];
  const s = size / 512;
  const r1 = 120 * scale, r2 = 112 * scale;
  const c1 = [256, 256], c2 = [256 + 50 * scale, 256 - 30 * scale];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size; x++) {
      let hit = 0;
      for (let sy = 0; sy < ss; sy++)
        for (let sx = 0; sx < ss; sx++) {
          const px = (x + (sx + 0.5) / ss) / s, py = (y + (sy + 0.5) / ss) / s;
          const in1 = (px - c1[0]) ** 2 + (py - c1[1]) ** 2 <= r1 * r1;
          const in2 = (px - c2[0]) ** 2 + (py - c2[1]) ** 2 <= r2 * r2;
          if (in1 && !in2) hit++;
        }
      const a = hit / (ss * ss);
      for (let i = 0; i < 3; i++) row[1 + x * 3 + i] = Math.round(BG[i] + (FG[i] - BG[i]) * a);
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

writeFileSync('public/icon-192.png', render(192, 1));
writeFileSync('public/icon-512.png', render(512, 1));
writeFileSync('public/icon-maskable-512.png', render(512, 0.75));
writeFileSync('public/apple-touch-icon.png', render(180, 1));

import fs from "node:fs";

const APPLY = process.argv.includes("--apply");

const songsFile = new URL("../data/songs.json", import.meta.url);
const brokenFile = new URL("../data/songs.broken.json", import.meta.url);
const songs = JSON.parse(fs.readFileSync(songsFile, "utf-8"));

const CONCURRENCY = 5; // ek saath 5 requests, YouTube ko tang na karo

const checkVideo = async (videoId) => {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (res.ok) return "ok";
    if (res.status === 404) return "not_found"; // video hata hua hai
    if (res.status === 401 || res.status === 403) return "not_embeddable"; // private ya embed band
    return `unknown_${res.status}`;
  } catch {
    return "network_error"; // video ka kasoor nahi, internet ya timeout
  }
};

const results = [];
let next = 0;

const worker = async () => {
  while (next < songs.length) {
    const index = next++;
    const song = songs[index];
    results.push({ index, song, status: await checkVideo(song.videoId) });
    if (results.length % 50 === 0) console.log(`Checked ${results.length}/${songs.length}...`);
  }
};

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
results.sort((a, b) => a.index - b.index);

const counts = {};
for (const { status } of results) counts[status] = (counts[status] || 0) + 1;
console.log("\nSummary:", counts);

const problems = results.filter((r) => r.status !== "ok");
for (const { song, status } of problems) {
  console.log(`- [${status}] ${song.title} | ${song.artists.join(", ")} | ${song.videoId}`);
}

if (!APPLY) {
  console.log("\nDry run: nothing was changed. Run with --apply to update the files.");
} else if (counts.network_error) {
  console.log("\nSome checks failed because of network errors. Nothing was changed. Run again.");
  process.exitCode = 1;
} else {
  const good = results.filter((r) => r.status === "ok").map((r) => r.song);
  const broken = problems.map(({ song, status }) => ({ ...song, reason: status }));

  fs.writeFileSync(songsFile, JSON.stringify(good, null, 2));
  if (broken.length > 0) {
    fs.writeFileSync(brokenFile, JSON.stringify(broken, null, 2));
  }
  console.log(`\nApplied. songs.json now has ${good.length} songs. ${broken.length} moved to songs.broken.json.`);
}
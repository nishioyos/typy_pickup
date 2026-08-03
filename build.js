const fs = require("fs");
const path = require("path");

const SERVICE_ID = process.env.MICROCMS_SERVICE_ID;
const API_KEY = process.env.MICROCMS_API_KEY;
const ENDPOINT = "pickup";

async function fetchAll() {
  let offset = 0;
  const limit = 100;
  let contents = [];

  while (true) {
    const res = await fetch(
      `https://${SERVICE_ID}.microcms.io/api/v1/${ENDPOINT}?limit=${limit}&offset=${offset}`,
      { headers: { "X-MICROCMS-API-KEY": API_KEY } }
    );
    if (!res.ok) throw new Error(`microCMS fetch failed: ${res.status}`);

    const data = await res.json();
    contents = contents.concat(data.contents);

    if (contents.length >= data.totalCount) break;
    offset += limit;
  }

  return contents;
}

async function main() {
  const contents = await fetchAll();

  const outDir = path.join(__dirname, "dist");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "pickup.json"),
    JSON.stringify(contents, null, 2)
  );

  console.log(`Generated pickup.json with ${contents.length} items`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

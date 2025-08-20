import fetch from "node-fetch";

function randomString(length = 7) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.endsWith(".mp4")) {
    return res
      .status(400)
      .json({ error: "Missing or invalid URL. Must be a direct .mp4" });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch video: ${response.statusText}` });
    }

    const filename = `scoopzrip_${randomString()}.mp4`;

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    response.body.pipe(res);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Download failed", details: err.message });
  }
}

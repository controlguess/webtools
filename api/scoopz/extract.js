import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { video } = req.query;

  if (!video) {
    return res.status(400).json({ error: 'Missing video URL in ?video=' });
  }

  try {
    const response = await fetch(video);
    const html = await response.text();

    const match = html.match(/https:\/\/v-cdn\.scoopzapp\.com[^"]+\.mp4/);

    if (match && match[0]) {
      return res.status(200).json({ raw_url: match[0] });
    } else {
      return res.status(404).json({ error: 'Unable to extract video' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch video page', details: err.message });
  }
}

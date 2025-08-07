import { searchAnime } from '../../lib/otakudesu';

export default async function handler(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const results = await searchAnime(q);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search anime' });
  }
}
import { getCompleteAnime } from '../../lib/otakudesu';

export default async function handler(req, res) {
  try {
    const { page = 1 } = req.query;
    const completeAnime = await getCompleteAnime(Number(page));
    res.status(200).json(completeAnime);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complete anime' });
  }
}
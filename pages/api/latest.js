import { getLatestUpdates } from '../../lib/otakudesu';

export default async function handler(req, res) {
  try {
    const updates = await getLatestUpdates();
    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest updates' });
  }
}
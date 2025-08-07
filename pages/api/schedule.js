import { getSchedule } from '../../lib/otakudesu';

export default async function handler(req, res) {
  try {
    const schedule = await getSchedule();
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
}
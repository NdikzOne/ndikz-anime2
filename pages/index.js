import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AnimeCard from '../components/AnimeCard';

export default function Home() {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestUpdates() {
      try {
        const response = await fetch('/api/latest');
        const data = await response.json();
        setLatestUpdates(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLatestUpdates();
  }, []);

  return (
    <Layout title="Latest Anime Updates">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Latest Updates</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {latestUpdates.map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
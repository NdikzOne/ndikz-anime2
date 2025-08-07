const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://otakudesu.best';

async function getLatestUpdates() {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);
    const updates = [];
    
    $('.venz .col-anime-con').each((i, el) => {
      const title = $(el).find('.col-anime-title a').text().trim();
      const episode = $(el).find('.col-anime-eps').text().trim();
      const thumbnail = $(el).find('.col-anime-cover img').attr('src');
      const url = $(el).find('.col-anime-title a').attr('href');
      const slug = url.split('/')[4];
      
      updates.push({ 
        title, 
        episode, 
        thumbnail, 
        slug,
        url: `/watch/${slug}`
      });
    });
    
    return updates;
  } catch (error) {
    console.error('Error fetching latest updates:', error);
    return [];
  }
}

async function getSchedule() {
  try {
    const { data } = await axios.get(`${BASE_URL}/jadwal-rilis`);
    const $ = cheerio.load(data);
    const schedule = {};
    
    $('.kglistweek').each((i, el) => {
      const day = $(el).find('.kgjdwlhari').text().trim();
      const items = [];
      
      $(el).find('.kglist .kgitem').each((j, item) => {
        const title = $(item).find('a').text().trim();
        const time = $(item).find('span').text().trim();
        const url = $(item).find('a').attr('href');
        const slug = url.split('/')[4];
        
        items.push({ 
          title, 
          time, 
          slug,
          url: `/watch/${slug}`
        });
      });
      
      schedule[day] = items;
    });
    
    return schedule;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return {};
  }
}

async function getCompleteAnime(page = 1) {
  try {
    const { data } = await axios.get(`${BASE_URL}/complete-anime/page/${page}/`);
    const $ = cheerio.load(data);
    const completeAnime = [];
    
    $('.col-anime').each((i, el) => {
      const title = $(el).find('.col-anime-title a').text().trim();
      const thumbnail = $(el).find('.col-anime-cover img').attr('src');
      const url = $(el).find('.col-anime-title a').attr('href');
      const slug = url.split('/')[4];
      
      completeAnime.push({
        title,
        thumbnail,
        slug,
        url: `/watch/${slug}`
      });
    });
    
    return {
      data: completeAnime,
      nextPage: $('.next.page-numbers').length > 0 ? page + 1 : null
    };
  } catch (error) {
    console.error('Error fetching complete anime:', error);
    return { data: [], nextPage: null };
  }
}

async function searchAnime(query) {
  try {
    const { data } = await axios.get(`${BASE_URL}/?s=${query}&post_type=anime`);
    const $ = cheerio.load(data);
    const results = [];
    
    $('.col-anime').each((i, el) => {
      const title = $(el).find('.col-anime-title a').text().trim();
      const thumbnail = $(el).find('.col-anime-cover img').attr('src');
      const url = $(el).find('.col-anime-title a').attr('href');
      const slug = url.split('/')[4];
      
      results.push({
        title,
        thumbnail,
        slug,
        url: `/watch/${slug}`
      });
    });
    
    return results;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
}

async function getAnimeDetails(slug) {
  try {
    const { data } = await axios.get(`${BASE_URL}/anime/${slug}`);
    const $ = cheerio.load(data);
    
    const title = $('.jdlrx h1').text().trim();
    const thumbnail = $('.fotoanime img').attr('src');
    const synopsis = $('.sinopc').text().trim();
    
    const episodes = [];
    $('#episode li').each((i, el) => {
      const episodeTitle = $(el).find('.lchx a').text().trim();
      const episodeUrl = $(el).find('.lchx a').attr('href');
      const episodeSlug = episodeUrl.split('/')[4];
      
      episodes.push({
        title: episodeTitle,
        url: `/watch/${episodeSlug}`,
        slug: episodeSlug
      });
    });
    
    return {
      title,
      thumbnail,
      synopsis,
      episodes
    };
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
}

async function getVideoSource(episodeSlug) {
  try {
    const { data } = await axios.get(`${BASE_URL}/episode/${episodeSlug}/`);
    const $ = cheerio.load(data);
    
    const videoUrl = $('#player iframe').attr('src');
    const downloadLinks = [];
    
    $('.downloadli').each((i, el) => {
      const resolution = $(el).find('strong').text().trim();
      const links = [];
      
      $(el).find('a').each((j, link) => {
        links.push({
          provider: $(link).text().trim(),
          url: $(link).attr('href')
        });
      });
      
      downloadLinks.push({
        resolution,
        links
      });
    });
    
    return {
      videoUrl,
      downloadLinks
    };
  } catch (error) {
    console.error('Error fetching video source:', error);
    return null;
  }
}

module.exports = {
  getLatestUpdates,
  getSchedule,
  getCompleteAnime,
  searchAnime,
  getAnimeDetails,
  getVideoSource
};
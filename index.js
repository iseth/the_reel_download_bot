const { Telegraf, Extra } = require('telegraf');
// import { message } from 'telegraf/filters';
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));

bot.on('forwardedMessage', (ctx) => {
  if (ctx.message.text.includes("reel/")) {
    download_video_form_message(message);
  }
});

bot.on('message', (ctx) => {
  if (ctx.message.text.includes("reel/")) {
    download_video_form_message(ctx);
  }
});

bot.launch();

function download_video_form_message(ctx) {
  let reel_id = ctx.message.text.split("reel/")[1].split(" ")[0].slice(0,11);

  console.log(reel_id);
  const headers = {
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    "x-rapidapi-host": "instagram-bulk-profile-scrapper.p.rapidapi.com"
  };

  axios.get(`https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/media_by_id?shortcode=${reel_id}&response_type=reels&corsEnabled=false`, {headers})
  .then(response => {
    let video_url = get_video_url(response);

    ctx.reply(`Downloading ${reel_id} ...`);

    axios.get(video_url, { responseType: 'stream' }).then(video_response => {
      ctx.replyWithVideo({ source: video_response.data });
    });

    // ctx.reply(video_url);
  })
  .catch(error => {
    console.error(error);
  });
}

function get_video_url(url) {
  return url.data[0]["items"][0]["video_versions"][0]["url"]
}
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
 * An HTTP endpoint that acts as a webhook for Discord message.create event
 * @param {object} event
 * @returns {any} result
 */
module.exports = async (event, context) => {

let result = {crawler: {}};

console.log(`Running [Crawler → Query (scrape) a provided URL based on CSS selectors]...`);
result.crawler.pageData = await lib.crawler.query['@0.0.1'].selectors({
  url: `https://secondary.hcdsb.org/bishopreding/calendar/action~agenda/request_format~json/`,
  userAgent: `stdlib/crawler/query`,
  includeMetadata: false,
  selectorQueries: [
    {
      'selector': `.ai1ec-event-header .ai1ec-event-title`,
      'resolver': `text`
    }
  ]
});


let result2 = {crawler: {}};

console.log(`Running [Crawler → Query (scrape) a provided URL based on CSS selectors]...`);
result2.crawler.pageData = await lib.crawler.query['@0.0.1'].selectors({
  url: `https://secondary.hcdsb.org/bishopreding/calendar/action~agenda/request_format~json/`,
  userAgent: `stdlib/crawler/query`,
  includeMetadata: false,
  selectorQueries: [
    {
      'selector': `.ai1ec-event-header .ai1ec-event-time`,
      'resolver': `text`
    }
  ]
});
console.log(result.crawler.pageData.queryResults[0].text);

let upcoming_events = "";
let max_space = 0;
for (let i = 0; i < 10; i++) {
  max_space = Math.max(max_space,
  `${(result.crawler.pageData.queryResults[0][i].text).trim()}`.length);
}
for (let i = 0; i < 10; i++) {
  upcoming_events += 
  `${(result.crawler.pageData.queryResults[0][i].text).trim()}` 
  + Array(max_space - `${(result.crawler.pageData.queryResults[0][i].text).trim()}`.length + 1).join(' ')
  + ' | '
  + `${(result2.crawler.pageData.queryResults[0][i].text).trim().replace('all day', '')}` 
  + '\n';
}

let messageResponse = await lib.discord.channels['@0.0.2'].messages.create({
  channel_id: `${event.channel_id}`,
  content: [
    `Here are some of the upcoming events at Bishop Reding:`,
    `\`\`\``,
    ['Event', Array(max_space - 4).join(' '), ' | ', 'Date'].join(''),
    Array(101).join('—'),
    upcoming_events,
    `\`\`\``].join('\n'),
});

return messageResponse;
}

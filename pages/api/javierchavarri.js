const cheerio = require('cheerio');
const { generateRssXml } = require('../../util/rss');

const ORIGIN = 'https://www.javierchavarri.com/'

export default async function handler(req, res) {
    const html = await fetch(ORIGIN).then(r => r.text())
    const $ = cheerio.load(html)
    const posts = $('#gatsby-focus-wrapper > div > div > div')
    const items = posts.toArray().map((el) => {
        const container = $(el)
        return {
        title: container.find('h3').text(),
        link: new URL(container.find('a').attr('href'), ORIGIN).toString(),
        pubDate: new Date(container.find('p:nth-of-type(1)').text().split('•')[0]).toUTCString(),
        description: container.find('p:nth-of-type(2)').text()
    }})
    const channel = { title: `Javier Chávarri's Blog`, description: `Javier Chávarri's Blog`, link: ORIGIN }
    res.setHeader('Content-Type', 'application/xml')
    res.status(200)
    res.send(generateRssXml(channel, items))
}

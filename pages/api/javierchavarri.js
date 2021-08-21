const cheerio = require('cheerio');

const ORIGIN = 'https://www.javierchavarri.com/'

function generateRssXml(channel, items) {
    function objectToXml(object) {
        return Object.entries(object).map(([key, value]) => `<${key}>${value}</${key}>`).join('')
    } 
    return `
    <rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel>
        ${objectToXml(channel)}
        ${items.map(item => `<item>${objectToXml(item)}</item>`).join('')}
    </channel>
    </rss>
    `
}

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

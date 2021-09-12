const cheerio = require('cheerio');
const { generateRssXml } = require('../../util/rss');

const ORIGIN = 'https://georgefrancis.dev/'
const HOME = 'https://georgefrancis.dev/writing/'

export default async function handler(req, res) {
    const html = await fetch(HOME).then(r => r.text())
    const $ = cheerio.load(html)
    const posts = $('ul.writing__posts > li > div.writing__post')
    const items = posts.toArray().map((el) => {
        const container = $(el)
        return {
        title: container.find('h2').text(),
        link: new URL(container.find('a').attr('href'), ORIGIN).toString(),
        pubDate: new Date(container.find('.writing__post-date').text()).toUTCString(),
        description: container.find('.writing__post-description').text().replace(/\n/g, '')
    }})
    const channel = { title: `georgefrancis writings`, description: `georgefrancis writings`, link: HOME }
    res.setHeader('Content-Type', 'application/xml')
    res.status(200)
    res.send(generateRssXml(channel, items))
}

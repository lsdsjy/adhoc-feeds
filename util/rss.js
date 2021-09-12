export function generateRssXml(channel, items) {
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
    function objectToXml(object) {
        return Object.entries(object).map(([key, value]) => `<${key}>${escapeHtml(value)}</${key}>`).join('')
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

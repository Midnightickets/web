
const Utils = {
    formatCurrency: (num, currency) => {
        switch (currency) {
            case 'brl':
                return 'R$ ' + num.toFixed(2).toString().replace('.', ',')
            default:
                return num
        }
    },
    formatBigString: (str) => {
        if (str.length > 8) {
            return str.slice(0, 8) + '...'
        }
        return str
    },
    getIframeLink(url) {
        const srcMatch = iframeString.match(/src="([^"]+)"/);
        return srcMatch ? srcMatch[1] : null;
    },
    checkSameTicketTypeTitle: (ticket_types) => {
        ticket_types.map((ticket) => ticket.title = ticket.title.toUpperCase().trim());
        const titles = ticket_types.map((ticket) => ticket.title);
        if (new Set(titles).size !== titles.length) return true
        return false
    }
}

export { Utils }
const Utils = {
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
    },
    convertStringToFirstAndLast: (bigString) => {
        // essa função serve para pegar a primeira e a última palavra de uma string
        const palavras = bigString.split(' ');
        if (palavras.length > 1) {
            return `${palavras[0]} ${palavras[palavras.length - 1]}`;
        } else {
            return bigString;
        }
    },
    logout: () => {
        const confirm = window.confirm('Deseja realmente Sair ?\n (づ￣ 3￣)づ \n');
        if (confirm) {
            sessionStorage.clear();
            window.location.href = '/';
        }
    },
    formatCurrency: (valor) => {
        if(typeof valor === 'number') {
            return valor.toFixed(2).toString().replace('.', ',')
        } else {
            if(valor.includes(',')) {
                valor = valor.replace(',', '.')
            }
            valor = Number(valor).toFixed(2)        
            return valor.toString().replace('.', ',')
        }
    }
}

export { Utils }
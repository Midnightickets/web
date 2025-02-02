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
    formatDate: (dateData) => {
  // Cria um objeto de data a partir da string
    if(!dateData) return 'xx/xx/xxxx xx:xx'
    const date = new Date(dateData);
    // Subtrai 3 horas (3 * 60 * 60 * 1000 ms)
    date.setHours(date.getHours());
    // Formata a data no formato DD/MM/AAAA HH:mm
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
    },
    logout: () => {
        const confirm = window.confirm('Deseja realmente finalizar sua sessão no Midnight Tickets ?\n');
        if (confirm) {
            sessionStorage.clear();
            window.location.href = '/';
        }
    },
    validateEmail: (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
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
    },
    emailResumed: (email) => {
        const emailSplit = email.split('@');
        return `${emailSplit[0].slice(0, 4)}***@${emailSplit[1]}`
    },
    toCamelCase: (str) => {
        // essa função serve para transformar a primeira letra de cada palavra em maiúscula
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
    verificaArraySemEspacos: (array) => {
        return array.every(str => !/\s/.test(str));
    },
    validaCPF: async (cpf) => {
        // Remove caracteres não numéricos
        const cpfClean = cpf.replace(/[^\d]/g, '');
        if (cpfClean.length !== 11) throw new Error('CPF INVÁLIDO');
        const calcDigit = (cpf, factor) => {
            let total = 0;
            for (let i = 0; i < factor - 1; i++) {
                total += cpf[i] * (factor - i);
            }
            const remainder = (total * 10) % 11;
            return remainder === 10 ? 0 : remainder;
        };
        const digit1 = calcDigit(cpfClean, 10);
        if (digit1 !== parseInt(cpfClean[9])) throw new Error('CPF INVÁLIDO');
        const digit2 = calcDigit(cpfClean, 11);
        if (digit2 !== parseInt(cpfClean[10])) throw new Error('CPF INVÁLIDO');
        return true;
    },
    goBack: () => {
        window.history.back()
    }
}

export { Utils }
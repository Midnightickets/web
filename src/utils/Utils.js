
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
    }
}

export { Utils }
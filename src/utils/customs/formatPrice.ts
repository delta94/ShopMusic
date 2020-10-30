export const formatPrice = (num: string | number) => {
    if (typeof num === 'number' || typeof num === 'string') {
        num = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
    return num + '₫';
};

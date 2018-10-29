export function rangeInt(start, end) {
    return Math.floor(
        Math.random() * (end - start)
    ) + start;
}

export function generateRandomIntegers (size = 10) {
    let data = [];
    for (let i = 0; i < size; i++) {
        data.push( rangeInt(0, 10) )
    }

    return data;
}
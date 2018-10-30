export function rangeInt(start, end) {
    return Math.floor(
        Math.random() * (end - start)
    ) + start;
}

export function generateRandomIntegers (size = 10, range = 10) {
    let data = [];
    for (let i = 0; i < size; i++) {
        data.push( {
            id: `haha-${i}`,
            value: rangeInt(0, range),
        } )
    }

    console.log("generated", data);
    return data;
}
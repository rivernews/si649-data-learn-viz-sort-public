export function rangeInt(start, end) {
    return Math.floor(
        Math.random() * (end - start)
    ) + start;
}

export function generateRandomIntegers(size = 10, range = 10) {
    let data = [];
    for (let i = 0; i < size; i++) {
        data.push({
            id: `id-${i}`,
            value: rangeInt(Math.ceil(range * .1), range),
        })
    }

    return data;
}

export function generateSortedIntegers(size = 10, range = 10) {
    let data = generateRandomIntegers(size, range);

    data.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1;
    });

    return data
}

export function generateSortedReverseIntegers(size = 10, range = 10) {
    let data = generateRandomIntegers(size, range);

    data.sort((a, b) => {
        return (a.value > b.value) ? -1 : 1;
    });

    return data
}

export function generateFewUniquesIntegers(size = 10, range = 10) {
    
}
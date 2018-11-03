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
            value: rangeInt(Math.ceil(range * .15), range),
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

export function generateRangeInt(start, end, isIncludingBothBoundaries = false) {
    let data = [];
    let last = (isIncludingBothBoundaries) ? end + 1: end;
    for (let i = start; i < last; i++) {
        data.push(i)
    }
    return data;
}
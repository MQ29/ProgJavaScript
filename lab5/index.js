const asyncAdd = async (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return Promise.reject('Argumenty muszą mieć typ number!')
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 100)
    })
}

const start = performance.now()
const numbers = Array.from({ length: 100 }, (_, i) => i + 1)
window.onload = () => {
    sum(...numbers)
        .then(result => {
            const end = performance.now()
            const time = end - start
            console.log("Wynik dodawania", result)
            console.log("Czas", time)
        })
}

const sum = async (...args) => {
    try {
        let asyncOperationsCount = args.length; 
        console.log("Początkowa liczba operacji asynchronicznych:", asyncOperationsCount);

        const results = await Promise.all(args.map(num => {
            return asyncAdd(0, num)
                .finally(() => asyncOperationsCount--); 
        }));

        const sum = results.reduce((acc, val) => acc + val, 0);
        return sum;
    }
    catch (error) {
        console.error(error.message);
    }
}

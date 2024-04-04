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
    // asyncAdd(2, 5).then(result => {
    //     const end = performance.now()
    //     const time = end - start
    //     console.log("Wynik dodawania", result)
    //     console.log("Czas dodawania", time)
    // })
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
        // let sum = 0;
        // for (const num of args) {                                          //10000ms
        //     if (Number.isInteger(num)) {
        //         sum = await asyncAdd(sum, num);
        //     } else {
        //         throw new Error("Argument" + num + "nie jest liczbą całkowitą.")
        //     }
        // }
        let asyncOperationsCount = args.length; 
        const results = await Promise.all(args.map(num => {
            return asyncAdd(0, num)
                .finally(() => asyncOperationsCount--); 
        }));
        
        console.log("Liczba operacji asynchronicznych:", asyncOperationsCount);

        const sum = results.reduce((acc, val) => acc + val, 0);
        return sum;
    }
    catch (error) {
        console.error(error.message);
    }
}


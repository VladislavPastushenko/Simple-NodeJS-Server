const fs=require('fs');

const getOrdersData = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname + '/../orders', null, async (err, files) => {
        const data = []
        const promises = []
        for (let i in files) {
            promises.push(new Promise(resolve => {
                    fs.readFile(__dirname + '/../orders/' + files[i], 'utf8', (err, fileData) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        const parsedData = JSON.parse(fileData)
                        data.push(parsedData)
                        resolve()
                    });
            }))
        }

        Promise.all(promises)
        .then(() => {
            resolve(data)
        })
        })
    })
}

module.exports = {getOrdersData}
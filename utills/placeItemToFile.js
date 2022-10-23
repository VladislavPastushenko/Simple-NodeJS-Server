const fs=require('fs');
const { uid } = require('./uid');

const placeItemToFile = (itemData) => {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname + '/../vendors', null, async (err, files) => {
            for (let i in files) {
                fs.readFile(__dirname + '/../vendors/' + files[i], 'utf8', (err, fileData) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    const parsedData = JSON.parse(fileData)

                    if (parsedData.id === parseInt(itemData.vendorId)) {
                        parsedData.supplies[itemData.categoryName][uid()] = {
                            name: itemData.name,
                            price: itemData.price,
                            stock: itemData.stock,
                            description: itemData.description
                        }
                        let json = JSON.stringify(parsedData);

                        fs.writeFile(__dirname + '/../vendors/' + files[i], json, 'utf8', (err) => {
                            if (err) {
                                console.log(err)
                                reject(err)
                            }
                            resolve('Success')
                        });
                    }
                });
            }
        })
    })
}

module.exports = {placeItemToFile}
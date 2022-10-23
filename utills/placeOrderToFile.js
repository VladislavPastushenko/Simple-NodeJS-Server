const fs=require('fs');
const { uid } = require('./uid');

const placeOrderToFile = (data) => {
    return new Promise((resolve, reject) => {
        let json = JSON.stringify(data);
        fs.writeFile(__dirname + '/../orders/' + uid() + '.json', json, 'utf8', (err) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            resolve(err)
        });
    })
}

module.exports = {placeOrderToFile}
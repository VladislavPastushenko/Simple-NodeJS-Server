const fs=require('fs');

const getIndex =  async (req, res) => {
    res.sendHtmlFile('../public/orderform.html');
}

const getPublicFile =  async (req, res) => {
    res.sendFile('../public' + req.url);
}

const getVendors =  async (req, res) => {
    fs.readdir(__dirname + '/../vendors', null, async (err, files) => {
        const data = []
        const promises = []
        for (let i in files) {
            promises.push(new Promise(resolve => {
                    fs.readFile(__dirname + '/../vendors/' + files[i], 'utf8', (err, fileData) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        data.push(JSON.parse(fileData))
                        resolve()
                    });
            }))
        }

        Promise.all(promises)
        .then(() => {
            res.send(data)
        })
    });
}

module.exports = {
    getIndex,
    getPublicFile,
    getVendors
}
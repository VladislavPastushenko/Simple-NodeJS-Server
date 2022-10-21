const getIndex =  async (req, res) => {
    res.sendHtmlFile('../public/orderform.html');
}

const getPublicFile =  async (req, res) => {
    res.sendFile('../public' + req.url);
}

module.exports = {
    getIndex,
    getPublicFile
}
const fs=require('fs');

module.exports = (req, res) => {
    res.sendHtml = (data) => {
        res.writeHead(200, {
            'Content-type': 'text/html; charset=UTF-8'
        })
        res.end(data);
    }

    res.sendHtmlFile = (path) => {
        fs.readFile(__dirname + '/' + path, null, (err, data) => {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=UTF-8'
            })
            res.end(data);
          });
    }


    res.sendFile = (path) => {
        fs.readFile(__dirname + '/' + path, null, (err, data) => {
            res.writeHead(200)
            res.end(data);
          });
    }
}
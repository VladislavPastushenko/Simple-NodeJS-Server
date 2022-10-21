const PORT = process.env.PORT || 3000;
const Application = require('./functionality/ser');
const router = require('./routes/routes');
const jsonParser = require('./functionality/parseJson');
const parseUrl = require('./functionality/parseUrl');

const app = new Application()

app.use(jsonParser);
app.use(parseUrl('http://localhost:3000'));

app.addRouter(router);


const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
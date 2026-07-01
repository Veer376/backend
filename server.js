import express from 'express';
import chatRouter from './src/routes/chat.js';
import documentRouter from './src/routes/document.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// middleware to log the requests on the backend.
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
  next();
});


app.use(chatRouter);
app.use(documentRouter);


app.get('/', (req, res) => {
  res.send('Server is Live!');
});

app.listen(3000, () => {
    console.log('Server is running on 3000');
})




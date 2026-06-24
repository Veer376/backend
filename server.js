import express from 'express';
import chatRouter from './src/routes/chat.js';

const app = express();

app.use(express.json());
app.use(chatRouter);

// middleware to log the requests on the backend.
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Server is Live!');
});

app.listen(3000, () => {
    console.log('Server is running on 3000');
})




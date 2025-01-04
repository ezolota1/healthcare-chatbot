const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const authRoutes = require('./routes/auth');
const chatbotAPI = require('./routes/chatbotAPI');
const doctorAPI = require('./routes/doctorAPI');
const appointmentAPI = require('./routes/appointmentAPI');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.username || null;
  next();
});

app.set('view engine', 'ejs');

app.use('/', authRoutes);
app.use('/chatbot', chatbotAPI);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

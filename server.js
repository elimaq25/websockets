const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: { 
    origin: '*',
  },
});

app.use(express.json());
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', './views');

app.engine(
  'hbs',
  engine({ 
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

let productsHC = [
  { id: 1, title: 'nike ball', price: 101, thumbnail: 'http://localhost:8080/public/nike-ball.jpg' },
  { id: 2, title: 'nike shoes', price: 102, thumbnail: 'http://localhost:8080/public/nike-shoes.jpg' },
  { id: 3, title: 'adidas shoes', price: 102, thumbnail: 'http://localhost:8080/public/adidas-shoes.jpg' },
];

let chat = [
  {
    email: 'ventas@lat.com',
    message: 'Wellcome',
    date: new Date().toLocaleDateString()
  }
]


app.get('/', (req, res) => {
  res.render('productslist', { root: __dirname + '/public' });
});


io.on('connection', (socket) => {
  console.log('New connection')
  io.sockets.emit('products', productsHC);
  io.sockets.emit('chat', chat);



  socket.on('newMessage', (msg) => {
    chat.push(msg);
    io.sockets.emit('chat', chat);
  });

  socket.on('newProduct', (data) => {
    productsHC.push(data);
    io.sockets.emit('products', productsHC);
  });



});



httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto`);
});

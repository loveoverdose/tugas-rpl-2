const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { login, register, updateProfile, checkUsername } = require('./models/Users');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('views'));
app.use(fileUpload({
    createParentPath: true
}));

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/views/index.html');
});

app.get('/profile', (req, res) => {
    return res.sendFile(__dirname + '/views/profile.html');
});

app.get('/login', (req, res) => {
    return res.sendFile(__dirname + '/views/login.html');
});

app.get('/register', (req, res) => {
    return res.sendFile(__dirname + '/views/register.html');
});

app.post(/^\/(login|register|profile)$/, async (req, res) => {
    if(req.params[0] === 'login') {
        const { username, password } = req.body;
        const name = await login(username, password);
        if(name.length !== 0) {
            res.cookie('id', name[0].id);
            res.cookie('name', name[0].name);
            return res.redirect('/');
        }
        return res.redirect('/login?m=Akun belum terdaftar');
    } else if(req.params[0] === 'register') {
        const { name, username, password } = req.body;
        const duplicate = await checkUsername(username);
        if(duplicate.length === 1) {
            return res.redirect('/register?m=Akun sudah terdaftar');
        }
        await register(name, username, password);
        return res.redirect('/login');
    } else if(req.params[0] === 'profile') {
        let namaFile;
        const photo = req.files?.photoProfile;
        if(photo != undefined) {
            namaFile = photo.name;
            photo.mv('./views/uploads/' + namaFile);
            res.cookie('photo', namaFile);
        }
        const { nama, password } = req.body;
        const id = req.cookies['id'];
        await updateProfile(namaFile, nama, password, id);
        res.cookie('id', id);
        res.cookie('name', nama);
        return res.redirect('/profile');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('id');
    res.clearCookie('name');
    res.clearCookie('photo');
    return res.redirect('/login');
});

io.on('connection', socket => {
    socket.on('chat message', msg => {
        const whoMessage = msg.split(':');
        socket.broadcast.emit('chat message', whoMessage);
    });
});

http.listen(3000, () => console.log('RUNNING'));
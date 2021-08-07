const express = require('express');
var request = require('request');
const bodyParser = require('body-parser');

const { MongoClient} = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var random_words = require('random-words');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const Schema = mongoose.Schema;

const vocabSchema = new Schema({
    question : String,
    correct_answer : String,
    options : [String]
})

const VocabModel = mongoose.model('VocabModel', vocabSchema);

const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        password : true
    }
})

const UserModel = mongoose.model('UserModel', UserSchema);

const mongoURI = "mongodb+srv://shreyas:chechu2000@cluster0.alx6d.mongodb.net/vocabulary?retryWrites=true&w=majority"
const jwtKey = "myjwtsecret"

const auth = (req, res, next) => {
    try{
        // console.log('test1')
        const token = req.header('x-auth-token')
        // console.log(token)
        jwt.verify(JSON.parse(token), jwtKey, (err, user) => {
            if (err) {
                console.log(err.message)
            }
            // console.log('verified')
            req.user = user;
            next();
        });
    }catch(error){
        res.sendStatus(401);
    }
     
}


// get user data route
app.get('/user', auth, (req,res) => {
    UserModel.findById(req.user.id)
    .select('-password')
    .then(user => {
        res.json(user);
    })
})

// to make the route private just add auth as second param
app.post('/addword', auth, async (req,res) => {
    // console.log(req.body)
    var newWordObject = VocabModel({
        question : req.body.word,
        correct_answer : req.body.meaning,
        options : random_words(3)
    });
    newWordObject.options.push(req.body.meaning)
    try{
        const findWord = await VocabModel.findOne({ question : req.body.word })
        if(!findWord){
            const savedDoc = await newWordObject.save()
            // console.log(savedDoc)
            if(!savedDoc) throw Error("Could not add the word")
            res.status(200).json({
                savedDoc
            })
            // console.log('finished')
        }
        console.log('word already exists')
    }catch(error){
       res.status(400).json({ msg : error.message })
    }
});


app.post('/search', (req,res) => {
    if(!req.body){
        return res.sendStatus(400);
    }
    var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + req.body.word;
    request(url, function(error,response,body){
        if(!error && response.statusCode === 200){
            // console.log(response)
            var parsedbody = JSON.parse(body);
            var meaning = parsedbody[0].meanings[0].definitions[0].definition
            res.send(meaning)
        }else{
            res.send(JSON.stringify(error))
        }
    });
    // console.log(req.body.word);
})

app.get('/listwords', auth,  async (req,res) => {
    try{
        // console.log('test2')
        const listWords = await VocabModel.find({})
        console.log(listWords)
        res.status(200).json({
            listWords
        })
    }
    catch(error){
        res.status(400).json({ msg : error.message})
    }
});

app.post('/deleteword', auth, (req,res) => {
    VocabModel.deleteOne({ question : req.body.currword })
    .then(result => {
        res.json({ status : "ok", result : result})
    })
    .catch((error) => {
        res.send(error)
    })
});

// register new user
app.post('/register', async (req,res) => {
    const { name,email,password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json({ msg : "Please enter all fields!!"});
    }
    try{
        const user = await UserModel.findOne({ email : email })
        if(user) throw Error("Account already exists")
        const salt = await bcrypt.genSalt(10);
        if(!salt) throw Error("Something went wrong with bcrypt");
        const hash = await bcrypt.hash(password, salt)
        if(!hash) throw Error("Could not hash password") 
        const newUser = new UserModel({
            name : name,
            email : email,
            password: hash
        });

        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');

        const token = jwt.sign({ id: savedUser._id }, jwtKey, {
            expiresIn: 3600
        });

        res.status(200).json({
            token,
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (e) {
         res.status(400).json({ error: e.message });
    }
});    

// authenticate user (login)
app.post('/auth', async (req,res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const user = await UserModel.findOne({ email });
        if (!user) throw Error('User does not exist');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');

        const token = jwt.sign({ id: user._id }, jwtKey, { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');
        res.status(200).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

try{
    mongoose.connect(mongoURI, {useCreateIndex : true,useNewUrlParser  : true, useUnifiedTopology : true});
    console.log("Connected to database")
}catch(error){
    console.log(error.message)
}


app.listen(5000, () => {
    console.log('server listening on port 5000');
})


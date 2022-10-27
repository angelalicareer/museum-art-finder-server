const express = require('express')
const sessions = require('./sessions')
const User = require('./models/user')
const bcrypt = require('bcrypt')
var cors = require('cors')
const port = process.env.PORT || 3001;

const app = express()
app.listen(port, () => console.log(`Server listening on ${port}`))
console.log(process.env.EXPRESS_SESSION_SECRET)
app.use(cors())
app.use(express.json())
app.use(sessions)

app.get('/user', (req, res) => {
   if (req.session.userId) {
    User
      .findById(req.session.userId)
      .then(user => res.json(user))
  } else {
    res.json({ error: 'no one logged in' })
  }
})

// Routes
app.post('/login', (req, res) => {
  const { email, pass } = req.body
  User
    .findByEmail(email)
    .then(user => {
      if (email == '' || pass == '') {
        res.status(400).json({ error: 'email and/or password cannot be blank' })
      } else {
        const isValidPassword = bcrypt.compareSync(pass, user.password_digest)

        if (user && isValidPassword) {
          // log the user in
          req.session.userId = user.id
          res.json({ id:user.id, email:user.email })
        }
      }
    })
})

app.post('/signup', (req, res) => { 
  const { name, email, pass } = req.body
    
  //using bcrypt to create passsword digest
  const passwordDigest = bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null)
  User
    .create(name, email, passwordDigest)
    .then(user => res.json(user))
})

app.delete('/', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err)
    }
  })
  res.json({status: "Ok"})
})

app.post('/favorites', (req, res) => {
  const { userId } = req.body
  User.getFavorites(userId).then(rows => res.json(rows))
})

app.post('/favorites/add', (req, res) => {
  const { userId, objId } = req.body
  User.addFavorite(userId, objId)
})

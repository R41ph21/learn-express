import express from "express"

const app = express()

// Middleware för att hantera JSON 
app.use (express.json())

// Enkel route för att testa servern
app.get('/', (req, res) => {
  res.json({ message: 'Välkommen till vår API!' })
})

//Simulerad databas
let users = [
  { id: 1, name: 'Anna', email: 'anna@example.com' },
  { id: 2, name: 'Erik', email: 'erik@example.com' },
  { id: 3, name: 'Maria', email: 'maria@example.com' },
]

//Get alla användare
app.get('/users', (req, res) => {
  res.json(users)
})

// Get en specifik användare med id
app.get('/users/:id', (req, res) => {
  const Id = parseInt(req.params.id)
  const user = users.find(u => u.id === Id)

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'Användare hittades inte' })
  }
})

// Get med query parameters
app.get('/search', (req, res) => {
  const { name } = req.query

  if (!name) {
    return res.status(400).json({ error: 'Namn parameter krävs' })
  }
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(name.toLowerCase())
  )
  
res.json(filteredUsers)
})

//Post - Skapa ny användare
app.post('/users', (req, res) => {
  const { name, email } = req.body

  //Validering 
  if (!name || !email) {
    return res.status(400).json({ error: 'Name och email krävs' 
    })
  }

  //Kontrollera om email redan finns
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email finns redan' 
    })
  }

  //Skapa ny användare
  const newUser = {
    id: users.length + 1,
    name,
    email
  }

  users.push(newUser)

  //Returnera skapad användare med status 201
  res.status(201).json(newUser)
})

//Delete - Ta bort användare
app.delete('/users/:id', (req, res) => {
  const Id = parseInt(req.params.id)
  const userIndex = users.findIndex(u => u.id === Id)
  
  if (userIndex ===-1) {
    return res.status(404).jason({
      error: 'Användare hittades inte'
    })
  }

  //Ta bort användaren
  const deletedUser = users.splice(userIndex, 1) [0]

  res.json({
    message: 'Användare borttagen',
    user: deletedUser
  })
})

// DELETE alla användare (farlig operation!)
app.delete('/users', (req, res) => {
  //Kräv bekräftelse via query parameter
  const { confirm } = req.query

  if (confirm !== 'yes') {
    return res.status(400).json({
      error: 'Bekräftelse krävs. Lägg till ?confirm=yes'
    })
  }

  const count = users.length
  users = []

  res.jason({
    message: `${count} användare borttagna`
  })
})

export default app

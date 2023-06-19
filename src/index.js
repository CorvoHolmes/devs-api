const express = require('express')
const axios = require('axios')

const app = express()

app.use(express.json())

const devs = []

const GITHUB_URL = "https://api.github.com/users"

async function getUserFromGithub(username) {
  try {
  const { data } = await axios.get(`${GITHUB_URL}/${username}`)

  return data
  } catch (error) {
    console.log(error.response.data);
  }

}

app.post("/devs", async (req, res) => {
  const { username } = req.body
  
  const devAlreadyExists = devs.some(dev => dev.username === username)

  if (devAlreadyExists) {
    return res.status(400).json({
      message: "Já existe um dev com esse nome!"
    })
  }

  const user = await getUserFromGithub(username)

  if (!user) {
    return res.status(400).json({
      message: "Usuário não encontrado no GitHub!"
    })
  }

  const dev = {
    id: user.id,
    name: user.name,
    username
  }

  devs.push(dev)

  return res.json({
    message: "Dev criado com sucesso!",
    dev
  })
})

app.get("/devs", (req, res) => {
  return res.json(devs)
})

app.listen(3333)
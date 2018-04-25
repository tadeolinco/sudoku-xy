import express from 'express';
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server is listening to port: ${port}`)
})
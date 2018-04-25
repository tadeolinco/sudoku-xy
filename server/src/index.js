import express from 'express';
import bodyParser from 'body-parser';
import solve from './solveSudoku';

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/solve', (req, res) => {
	const solutions = solve(req.body.puzzle); 
	res.status(200).json({solutions});
});

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server is listening to port: ${port}`)
})
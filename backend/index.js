const express = require('express')

const app = express()

app.get('/api', (req, res) => {
    res.status(200).json({
        hello: "world"
    })
})

app.get('*', (req, res) => {
    res.status(404).json({
        status: 'not found'
    })
})

app.listen(3000)
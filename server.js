const express = require('express')
const routes = express.Router()
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = 4000

let itemSchema = require('./models/model')

app.use(cors())
app.use(bodyParser.json())

const mongoURI = 'mongodb+srv://<DBuser>:<DBpassword>@bucket-list-ymsna.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(mongoURI, { useNewUrlParser: true })

const connection = mongoose.connection

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!')
})


routes.route('/').get((req, res) => {
    itemSchema.find((err, itemlist) => {
        if(err) {
            console.log(err)
        } else {
            res.json(itemlist)
        }
    })
})

routes.route('/:id').get((req, res) => {
    let id = req.params.id
    itemSchema.findById(id, (err, data) => {
        res.json(data)
    })
})

routes.route('/:id').delete((req, res) => {
    let id = req.params.id
    itemSchema.findByIdAndDelete(id)
        .then(() => res.json('bucket deleted'))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

routes.route('/update/:id').post((req, res) => {
    itemSchema.findById(req.params.id, (err, dataItem) => {
        if(!dataItem)
            res.status(404).send('data not found')
        else
            dataItem.item = req.body.item
            dataItem.total = req.body.total
            dataItem.saved = req.body.saved
            
            dataItem.save().then(dataItem => {
                res.json('data updated!')
            })
            .catch(err => {
                res.status(400).send('update not possible')
            })
    })
})

routes.route('/add').post((req, res) => {
    let dataItem = new itemSchema(req.body)
    dataItem.save()
        .then(dataItem => {
            res.status(200).json({dataItem: 'item added successfully'})
        })
        .catch(err => {
            res.status(400).send('adding new item failed')
        })
})

app.use('/itemlist', routes)

app.listen(PORT, () => {
    console.log('Server is running on Port: ' + PORT)
})

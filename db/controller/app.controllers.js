const endpoints = require('../../endpoints.json')
const db = require('../connection')
const { getTopics } = require('../model/app.model')


exports.fetchEndPoints = (req, res, next) => {
    res.status(200).send({endpoints})
}   

exports.fetchTopics = (req, res , next) => {
    getTopics().then((topics)=>{
        res.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}



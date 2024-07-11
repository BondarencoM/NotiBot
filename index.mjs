import express from 'express'

import { update as _update } from './main.mjs'

const update = async (req, res, next) => {
    try {
        await _update()
        res.status(200).send("OK")
    }
    catch (e) {
        next(e)
    }
    
}

const app = express()

app.post('/update', update)
app.listen(process.env.PORT || 3000)
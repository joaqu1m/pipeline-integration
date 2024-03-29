const express = require("express")
const cors = require("cors")
const app = express()
require("dotenv").config()

app.use(cors())

const crmApi = require("./src/crmRoutine/controller")
const pipefyApi = require("./src/pipefyRoutine/controller")

let crmApiStatus = true
let pipefyApiStatus = true

// ================================
// =        CRM MAILER API        =
// ================================

const crmIntervaloCheck = 15000
let crmIntervalId1

const ligarCrmApi = (res) => {

    clearInterval(crmIntervalId1)

    crmIntervalId1 = setInterval(() => {
        crmApi.run()
    }, crmIntervaloCheck)

    crmApiStatus = true
    console.log("API Crm Rodando")
    res?.status(200).send()
}
const desligarCrmApi = (res) => {

    clearInterval(crmIntervalId1)

    crmApiStatus = false
    console.log("API Crm Ociosa")
    res?.status(200).send()
}

// ================================
// =          PIPEFY API          =
// ================================

const pipefyIntervaloCheck = 15000
let pipefyIntervalId1, pipefyIntervalId2

const ligarPipefyApi = (res) => {

    clearInterval(pipefyIntervalId1)
    clearInterval(pipefyIntervalId2)

    pipefyIntervalId1 = setInterval(() => {
        pipefyApi.getInsercoesBD(1)
        pipefyApi.getInsercoesBD(2)
    }, pipefyIntervaloCheck * 0.66)
    pipefyIntervalId2 = setInterval(() => {
        console.log("Procurando por novos dados...")
        pipefyApi.getInsercoesPipefy(1)
        pipefyApi.getInsercoesPipefy(2)
    }, pipefyIntervaloCheck)

    pipefyApiStatus = true
    console.log("API Pipefy Rodando")
    res?.status(200).send()
}
const desligarPipefyApi = (res) => {

    clearInterval(pipefyIntervalId1)
    clearInterval(pipefyIntervalId2)

    pipefyApiStatus = false
    console.log("API Pipefy Ociosa")
    res?.status(200).send()
}

ligarCrmApi()
ligarPipefyApi()

app.post("/crm/ligar", (_, res) => ligarCrmApi(res))
app.post("/crm/desligar", (_, res) => desligarCrmApi(res))
app.get("/crm/checar", (_, res) => res.status(200).send(crmApiStatus))

app.post("/pipefy/ligar", (_, res) => ligarPipefyApi(res))
app.post("/pipefy/desligar", (_, res) => desligarPipefyApi(res))
app.get("/pipefy/checar", (_, res) => res.status(200).send(pipefyApiStatus))

app.listen(8081)

import { CosmosClient } from '@azure/cosmos'
import credentials from '../Common/credential'

const CosmosClient = require('@azure/cosmos').CosmosClient

const cosmosClient = new CosmosClient({
    endpoint: credentials.cosmos.URL,
    key: credentials.cosmos.KEY
})


//  create database if not exists

async function createDatabase() {
    const { database } = await cosmosClient.databases.createIfNotExists({
        id: credentials.cosmos.DATABASE
    })
    console.log(`Created database:\n${database.id}\n`)
}


// read the database defination

async function readDatabase() {
  const { resource: databaseDefinition } = await cosmosClient
    .database(databaseId)
    .read()
  console.log(`Reading database:\n${databaseDefinition.id}\n`)
}


export {
    cosmosClient, createDatabase, readDatabase
}

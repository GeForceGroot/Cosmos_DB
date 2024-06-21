import { CosmosClient } from "@azure/cosmos";
import credentials from "../Common/credential";


async function createTask(task) {

    const { database } = await CosmosClient.databases.createIfNotExists({ id: credentials.cosmos.DATABASE });
    const { container } = await database.containers.createIfNotExists({ id: containerId });
    const { resource: createdTask } = await container.items.create(task);
    return createdTask;
}
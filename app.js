import { CosmosClient } from "@azure/cosmos";
import express, { json, response } from 'express';
const app = express()

const port = 3000;

//  Create Connection to CosmosDB

const endpoint = 'https://localhost:8081';
const key = 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==';

const options = {
    endpoint: endpoint,
    key: key,
    userAgentSuffix: 'CosmosDBJavascriptQuickstart'
};

//  New Connection
const client = new CosmosClient(options)

const databaseId = 'SampleDB';

app.use(json())
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


//  Create a new Database if not exists and then container

async function createTask(task) {
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: 'Task' });
    const { resource: createdTask } = await container.items.create(task);
    return createdTask;
}

async function createEmployee(employee) {
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: 'Employee' });
    const { resource: createdEmployee } = await container.items.create(employee);
    return createdEmployee;
}
async function assignTasks(employeeHaveTasks) {
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: 'EmployeeHaveTasks' });
    const { resource: assignTasks } = await container.items.create(employeeHaveTasks);
    return assignTasks;
}



//  Get task by EmpId

async function getTasksByEmpId(empId) {
    const database = client.database(databaseId);

    const employeeTasksContainer = database.container('EmployeeHaveTasks');
    const querySpec1 = {
        query: 'SELECT c.taskId FROM c WHERE c.empId = @empId',
        parameters: [
            {
                name: '@empId',
                value: empId
            }
        ]
    };
    const { resources: employeeTasks } = await employeeTasksContainer.items.query(querySpec1).fetchAll();
    
    const taskIds = employeeTasks.map(task => task.taskId);
    
    const taskContainer = database.container('Task');
    const querySpec2 = {
        query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(@taskIds, c.id)',
        parameters: [
            {
                name: '@taskIds',
                value: taskIds
            }
        ]
    };
    const { resources: taskDetails } = await taskContainer.items.query(querySpec2).fetchAll();
    console.log(taskDetails)

    return taskDetails;
}


//  Delete Container

async function deleteTaskConst(conatinerName){
    const database = client.database(conatinerName);
    const container = database.container('Task');
    const { resources } = await container.delete();
    return resources;
}


app.delete('/:Name',async (req, res)=>{
    const name = req.params.Name
    try{
        const deleteS = await deleteTaskConst(name);
        console.log('deleted succesfully')
    }
    catch(e){
        console.log('error', e)
    }
})


app.post('/addTask', async (req, res) => {
    const task = req.body;
    try {
        const createdTask = await createTask(task);
        res.status(201).json(createdTask);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})


app.post('/addEmployees', async (req, res) => {
    const employee = req.body;
    try {
        const createdEmployee = await createEmployee(employee);
        res.status(201).json(createdEmployee);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/assignTask', async (req, res) => {
    const taskEmployeeData = req.body
    try {
        const assignTask = await assignTasks(taskEmployeeData);
        res.status(201).json(assignTask)
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})


app.get('/:id', async (req, res) => {
    const empId = req.params.id
    try {
        const tasksId = await getTasksByEmpId(empId)
        console.log(tasksId)
        res.status(201).json(tasksId)
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.listen(port, () => [
    console.log('sever is running on http://localhost:3000')
])
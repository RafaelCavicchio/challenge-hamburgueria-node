const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()

//ToDo 

app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex(ord => ord.id === id)

    if (index < 0 ){
        return response.status(404).json({message : "Order not found"})
    }

    request.orderIndex = index

    next()
}

const requestLog = (request, response, next) => {
    const methodCalled = request.method
    const urlCalled = request.url

    console.log(`${methodCalled} - ${urlCalled}`)

    next()
}

app.use(requestLog)

app.get("/orders/:id", checkOrderId, (request, response) => {    
    const index = request.orderIndex

    const order = orders[index]

    return response.json(order)
})

app.get("/orders", (request, response) => {    
    return response.json(orders)
})

app.post("/orders", (request, response) => {
    const {order, clientName, price} = request.body

    const newOrder = {id: uuid.v4(), order, clientName, price, status : 'Em preparação'}

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.put("/orders/:id", checkOrderId, (request, response) => {
    const {order, clientName, price} = request.body
    const {id} = request.params
    const index = request.orderIndex

    const status = orders[index].status

    const updatedOrder = {id,order,clientName,price, status}

    orders[index] = updatedOrder

    return response.json(updatedOrder)

})

app.delete("/orders/:id", checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json({message : "Order deleted successfully"})
})

app.patch("/orders/:id", checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders[index].status = "Pronto"

    return response.json({message: "Pedido pronto!"})
})

app.listen(port, () =>{
    console.log(`🚀 App started port: ${port}`)
})
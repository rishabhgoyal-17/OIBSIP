import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

let addtocart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter")
function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            text: 'Item added to cart',
            type: 'success',
            timeout: 1000,
            progressBar: false
        }).show()
    }).catch(err => {
        new Noty({

            timeout: 1000,
            text: 'Something went wrong',
            type: 'error',
            progressBar: false
        }).show()
    })
}
addtocart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizzas)
        updateCart(pizza)

    })
})




//remove alert after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

//initAdmin()

//complete code of admin.js will be added by this function 

//Change order status
let statuses = document.querySelectorAll('.status_line')

let hiddenInput = document.querySelector('#hiddenInput')

let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement("small")

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')

    })
    let stepCompleted = true;

    statuses.forEach((status) => {
        let dataProp = status.dataset.status //data-*status* in singleorder.ejs is same status here
        if (stepCompleted) {
            status.classList.add('step-completed') //makes grey o
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A') //adding time at right
            status.appendChild(time)
            if (status.nextElementSibling) { //we get next element of the step completed

                status.nextElementSibling.classList.add('current')
            }
        }

    })

}
updateStatus(order);





//Ajax call




//io is available as we installed in server and put script tag in layout

//Socket
let socket = io()

//Join
if (order) {
    socket.emit('join', `order_${order._id}`) //sends join at server
}
let adminAreaPath = window.location.pathname
console.log(adminAreaPath)
if (adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}
//Listening event from server of orderUpdated
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }  //copying order
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    console.log(data)
    updateStatus(updatedOrder)
    new Noty({
        text: 'Order Updated',
        type: 'success',
        timeout: 1000,
        progressBar: false
    }).show()
})

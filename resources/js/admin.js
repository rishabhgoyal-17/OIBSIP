import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'


export function initAdmin(socket) {
    const orderTablebody = document.querySelector('#orderTableBody')
    let orders = []
    let markup //we will be needing html markup for our table
     axios.get('/admin/orders',{
        headers: {
             'X-Requested-With': 'XMLHttpRequest'
         }
     }).then(res => {
    
          orders = res.data
        console.log(orders)
         markup = generateMarkup(orders)
        orderTablebody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })
    /*async function getUserData() {
        try {
            const response = await axios.get('/admin/orders', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
           
            orders = response.data
            console.log(orders)
            markup = generateMarkup(orders)
            orderTablebody.innerHTML = markup
        }
        catch (error) {
            console.log(error);
        }
    }
    getUserData()*/
    function renderItems(items) {
        let parsedItems = Object.values(items)
        //array of items here
        console.log(parsedItems)
        return parsedItems.map((menuItem) => { //using map which iterates on single element everytime, with each having another paragra[h]
            //name:qty 
            return `
                <p>${menuItem.item.name} - ${menuItem.qty} pcs </p>   
            `
        }).join('')  //all the paragraph are joined using thsis
    }


    function generateMarkup(orders) {
        //map called on array, which loops on it whatever is returned thing is in the form of array  
        return orders.map(order => {
            return `
                    <tr>
                    <td class="border px-4 py-2 text-green-900">
                        <p>${order._id}</p>
                        <div>${renderItems(order.items)}</div>
                    </td>
                    <td class="border px-4 py-2">${order.customerId.name}</td>
                    <td class="border px-4 py-2">${order.address}</td>
                    <td class="border px-4 py-2">
                        <div class="inline-block relative w-64">
                            <form action="/admin/order/status" method="POST">
                                <input type="hidden" name="orderId" value="${order._id}"> 
                                <select name="status" onchange="this.form.submit()"
                                    class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="order_placed"
                                        ${order.status === 'order_placed' ? 'selected' : ''}>
                                        Placed</option>
                                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>
                                        Confirmed</option>
                                    <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>
                                        Prepared</option>
                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>
                                        Delivered
                                    </option>
                                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>
                                        Completed
                                    </option>
                                </select>
                            </form>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </td>
                    <td class="border px-4 py-2">
                        ${moment(order.createdAt).format('hh:mm A')}
                    </td>
                    <td class="border px-4 py-2">
                        ${order.paymentStatus ? 'paid' : 'Not paid'}
                    </td>
                </tr>
            `
        }).join('')
    }

    //Socket 
    //client orders and admin page updates real time
    socket.on('orderPlaced',(order)=>
    {
        console.log("From admin js",order)
       
        orders.unshift(order)  //pushing element at front 
        orderTablebody.innerHTML=''
        new Noty({
            text: 'New Order',
            type: 'success',
            timeout: 1000,
            progressBar: false
        }).show()
        orderTablebody.innerHTML=generateMarkup(orders)
    })
}



//renderItems is use for itemname:qty
//in each row of table we are using order.customerId.name,order.customerId.address
//and extracting name and address as we have populated customerId
//form is made, select box on changing status we submit form
//options are given and selected based on status
// next div is taken from tailwind css for custom select box
//things wriiten as name we get those on server and we have used them in status controller req.body.orderId

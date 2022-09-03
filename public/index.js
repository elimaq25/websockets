const socket = io(); 

socket.on('connection', () => {
    console.log('You are connected')
})


let prod = [];
socket.on('products', (data) => {
    
    prod = data;

    let htmlToRender = '';

    for (let i = 0; i < prod.length; i++) {
        htmlToRender = htmlToRender + `
        <tr>
        <td> <h1> ${ prod[i].title }</h1> </td>
         <td> <h1> ${ prod[i].price }</h1> </td>
         <td> <img src="${ prod[i].thumbnail}" /> </h1> </td>
        </tr>
        `
    }

    let htmlMap = data.map( prod => {
        return `
        <tr>
        <td> <h1> ${ prod.title }</h1> </td>
         <td> <h1> ${ prod.price }</h1> </td>
         <td> <img src="${ prod.thumbnail}" /> </h1> </td>
        </tr>
        `
    })


    let htmlReduce = data.reduce((previewHtml, currentHtml) => previewHtml + `
    <tr>
    <td> <h1> ${ currentHtml.title }</h1> </td>
     <td> <h1> ${ currentHtml.price }</h1> </td>
     <td> <img src="${ currentHtml.thumbnail}" /> </h1> </td>
    </tr>
    `, ''
    
    )

 

    document.querySelector('#products').innerHTML = htmlReduce;

})



socket.on('chat', (data) => {
    let htmlReduce = data.reduce((previewHtml, currentHtml) => previewHtml + `
    <tr>
    <td> <h1> ${ currentHtml.email }</h1> </td>
     <td> <h1> ${ currentHtml.message }</h1> </td>
     <td> <h1> ${ currentHtml.date}" </h1> </td>
    </tr>
    `, ''
    
    )

    document.querySelector('#message').innerHTML = htmlReduce;
})

function addMessage(addMessage) {
    let messageToAdd = {
        email: addMessage.email.value,
        message: addMessage.message.value,
        date: new Date().toLocaleDateString(),
    }
    socket.emit('newMessage', messageToAdd)
}

function addProduct(addProduct) {
    let product = {
        title: addProduct.title.value,
        price: addProduct.price.value,
        thumbnail: addProduct.thumbnail.value,
    }
    socket.emit('newProduct', product)
}
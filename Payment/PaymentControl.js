const express = require('express')
const Razorpay = require('razorpay')
const uniqueID = require('uniqid')
var nodemailer=require('nodemailer')
const httpProxyClient = require('nodemailer/lib/smtp-connection/http-proxy-client')
require('dotenv/config')
const Swal = require('sweetalert2')

let app = express()
let orderId
//store this in the database
// {
//     "razorpay_payment_id": "pay_29QQoUBi66xm2f",
//     "razorpay_order_id": "order_9A33XWu170gUtm",
//     "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
//   }
// let order_id_var

const razorpay = new Razorpay({
    key_id: 'rzp_test_Dc8k9akyGMSOgx',
    key_secret: 'Zb6BGm9DWG5j2NRpGesk8unw'
})

app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/order', (req, res) => {

    let options = {
        amount: 500 * 100,
        currency: "INR",
        receipt: uniqueID(),
    };

    razorpay.orders.create(options, (err, order) => {
        // order_id_var=order.id
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        console.log(order)
        // orderId = order.id
        res.json(order)
    })
})

function displayconfirmed ()
{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
    swalWithBootstrapButtons.fire({
        title: 'Payment Successful!!',
        text: "Your transaction was successful",
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Download invoice',
        cancelButtonText: 'Back',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Invoice generation successful!',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
          //nothing
          )
        }
      })
}

app.post('/is-order-completed', (req, res) => {
    
    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {

        console.log(paymentDocument)
        if (paymentDocument.status == 'captured')
            {
                // var transporter=nodemailer.createTransport({
                //     service: 'gmail',
                //     auth: {
                //         user: 'gojos8675@gmail.com',
                //         pass: '#GojoSatoru24'
                //     }
                // });
                // var mailOptions={
                //     from: 'gojos8675@gmail.com',
                //     to: 'neophytesAdm@gmail.com',
                //     subject: `NO REPLY: Payment done for ${paymentDocument.email}` ,
                //     text: `Payment of Rs. ${paymentDocument.amount/100} Successful for ${paymentDocument.email} and ${paymentDocument.contact} via ${paymentDocument.method} for the current month`               
                // };

                // transporter.sendMail(mailOptions,(err,info)=>{
                //     if(err)
                //     {
                //         console.log(err)
                //     }
                //     else{
                //         console.log('Email sent: '+info.response)
                //     }
                // })
                  
                  displayconfirmed();
                  
                res.redirect('/');
            }
        else
            res.redirect('/')
    })
})
app.listen(5000)

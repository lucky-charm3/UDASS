const mailer=require('nodemailer');

const transport=mailer.createTransport({
    service:'Gmail',
    port:465,
    secure:true,
    auth:{
        user:process.env.APP_EMAIL,
        pass:process.env.APP_PASSWORD
    }
})

module.exports=transport;
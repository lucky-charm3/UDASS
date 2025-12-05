const transport=require('../config/emailConfig');

const sendEmail=async (options)=>{
    const emailOptions={
        from:'UDASS',
        to:options.to,
        subject:options.subject,
        html:options.html
    }
    return await transport.sendMail(emailOptions);
}

module.exports=sendEmail;
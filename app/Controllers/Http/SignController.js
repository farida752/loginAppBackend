'use strict'


const client = use('App/Models/Client')
class SignController {
    async addUser({request,response}){
      if(request.body.email === null){
        response.send({status : false, msg : "No email found!"});
        return;
      }
      if(request.body.password === null && request.body.googleAuth === false){
        response.send({status : false, msg : "No password found!"});
        return;
      }
      const currentClientIds = await client.query().where('email', request.body.email).ids();
        if(currentClientIds.length != 0) {// already exists // check if it comes from google{\
            if(request.body.googleAuth == false){
           response.send({status : false, msg : "emailExists!"});
           }
            else if(request.body.googleAuth == true){
              response.send({status : true, msg : "success!"});
            }
            return;
        }
        const newClient = new client();
        newClient .email =  request.body.email;
        newClient.password = request.body.password;
        await newClient.save();
      response.send({status : true, msg : "success!"});
    }

    async signin({request,response}){
      if(request.body.email === null){
        response.send({status : false, msg : "No email found!"});
        return;
      }
      if(request.body.password === null){
        response.send({status : false, msg : "No password found!"});
        return;
      }
        const currentClientIds = await client.query().where('email', request.body.email).ids();
        if(currentClientIds.length != 0){
        const currentClient = await client .find(currentClientIds);
        if(currentClient.password === request.body.password){
            response.send({status : true, msg : "success!"});
            return;
        }else{
          response.send({status : false, msg : "Incorrect password!"});
          return;
        }
      }
      
       response.send({status:false,msg:"Email not found , you can signUp",ids:currentClientIds,size:currentClientIds.length});
    }
   
    async showUsers({reruest,response}){
        const clients = await client.all();
        response.send(clients);
}
async remove({request,response}){
  const currentClientIds = await client.query().where('email', request.body.email).delete();
}
}
module.exports = SignController

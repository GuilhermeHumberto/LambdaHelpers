/**
    // JSON to send test
    {
        "requestType": "toggleInstanceType",
        "instanceRegion": "sa-east-1",
        "instanceId": [
            {
            "typeDefault": "t2.medium",
            "id": "i-04c125a3da9312fe0"
            }
        ]
    }
 */


const AWS = require('aws-sdk')

exports.handler = (event, context, callback) => {
    const ec2 = new AWS.EC2({ region: event.instanceRegion })
    
    const lightInstance = "t2.micro"
    
    const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))
    
    async function getStatsInstance(id){
        let instanceStatus = await ec2.describeInstances({InstanceIds: [id]}).promise()
        .then((d) => d)
        .catch((err) => err)
        return new Promise((resolve, reject) => resolve(instanceStatus))
    }
    
    event.instanceId.forEach(async instance => {

        // get instance type before update
        let oldInstance = await ec2.describeInstanceAttribute({
            Attribute: "instanceType", 
            InstanceId: instance.id
        }).promise()
        .then((data) => data.InstanceType.Value)
        .catch((err) => callback(err))
        
        // verify current instance type and set new value in variable
        let instanceChanged = oldInstance == lightInstance ? instance.typeDefault : lightInstance
        let params = {
            InstanceId: instance.id, 
            InstanceType: {
                Value: instanceChanged
            }
        }
        
        // stop instance to change type
        let stopInstance = await ec2.stopInstances({InstanceIds:[instance.id]}).promise()
        .then((d) => d)
        .catch(err => callback(err))
        
        // if instance is stopping, await instance stop completly
        if(stopInstance.StoppingInstances[0].CurrentState.Code == 64){
            for(var i=0; i<10; i++){
                await sleep(5000) // await 5 seconds
                
                let instanceStatus = await getStatsInstance(instance.id)
                if(instanceStatus.Reservations[0].Instances[0].State.Code == 80){
                    break    
                }    
            }
        }
        
        let instanceStatus = await getStatsInstance(instance.id)
        // if instance is stoped (80)
        if(instanceStatus.Reservations[0].Instances[0].State.Code == 80){
            
            // update istance type        
            let changeInstance = await ec2.modifyInstanceAttribute(params).promise()
            .then((data) => data)
            .catch((err) => callback(err))
            
            // if instance is changed, start 
            let startInstance = await ec2.startInstances({InstanceIds:[instance.id]}).promise()
            .then((data) => data)
            .catch(err => callback(err))
            
            // if instance started successfully
            if([0, 16].indexOf(startInstance.StartingInstances[0].CurrentState.Code) > -1){
                callback(null, "Instance changed and started successfully!")
            }else{
                callback(null, "An error as ocurred when start the instance")
            }
        }else{
            callback(null, 'Instance is not stopped '+stopInstance.StoppingInstances[0].CurrentState.Code)
        }
        
    })
}
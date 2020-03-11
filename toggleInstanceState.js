/**
    // JSON to send test (OFF)
    {
        "typeRequest": "toggleOff",
        "instanceRegion": "sa-east-1",
        "instanceId": [
            "i-04c125a3da9312fe0"
        ]
    }

    // JSON to send test (ON)
    {
        "typeRequest": "toggleOn",
        "instanceRegion": "sa-east-1",
        "instanceId": [
            "i-04c125a3da9312fe0"
        ]
    }
 */

const AWS = require('aws-sdk')
exports.handler = (event, context, callback) => {
    const ec2 = new AWS.EC2({ region: event.instanceRegion })
    
    event.instanceId.forEach(id => {
        if(event.typeRequest == "toggleOn"){
            ec2.startInstances({InstanceIds:[id]}).promise()
            .then(() => callback(null,`Successfully Started ${id}`))
            .catch(err => callback(err))
        }else if(event.typeRequest == "toggleOff"){
            ec2.stopInstances({InstanceIds:[id]}).promise()
            .then(() => callback(null,`Successfully Stopped ${id}`))
            .catch(err => callback(err))
        }else{
            callback(null, "Type of request invalid")
        }
    })   
}
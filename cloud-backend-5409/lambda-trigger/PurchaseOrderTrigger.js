console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const docClient = new aws.DynamoDB.DocumentClient();


exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        const objectValue = await s3.getObject(params).promise();
        console.log('CONTENT TYPE:', objectValue);
        const jsonValue = JSON.parse(objectValue.Body.toString('utf8'));
        let str = ''
        for (const [key, value] of Object.entries(jsonValue['items'])) {
            console.log(jsonValue['items'][key],jsonValue['price'][key],jsonValue['quantity'][key]);
            str+= jsonValue['items'][key] + ' ' + jsonValue['price'][key] + ' ' +jsonValue['quantity'][key] + '\n';
            const params = {
                TableName:'products',
                Key:{
                    "productName": jsonValue['items'][key]
                },
                UpdateExpression: "set quantity = quantity + :val",
                ConditionExpression: 'productName = :productNameVal',
                ExpressionAttributeValues:{
                    ":val": +jsonValue['price'][key],
                    ":productNameVal": jsonValue['items'][key]
                },
                ReturnValues:"UPDATED_NEW"
            }
            try{
            let result = await docClient.update(params).promise();
            str += result
            console.log(result)
            }catch(err){
                
            }
        }
        // var param2 = {
        //     TableName: 'products',
        //     Key:{
        //         "productName": 'Pen'
        //     }
        // };
        
        // const value = await docClient.get(param2).promise();
        // str += value
        // console.log(value)
        return str
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        // throw new Error(message);
    }
};

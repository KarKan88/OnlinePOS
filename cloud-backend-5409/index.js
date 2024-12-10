const AWS = require("aws-sdk");
const express = require("express");
const app = express();
app.use(express.json());

const lambda = new AWS.Lambda({
  accessKeyId: "ASIA4ACA2CZTEPKXLCNQ",
  secretAccessKey: "2CP6Y/FOpoHd+suk0cDEnvRGtr3s9r1jisTYtsK5",
  sessionToken:
    "FwoGZXIvYXdzEP3//////////wEaDEBC/ZYU7sI+zY3rRiLAAajg1fP3EtRf1tgqI4HamrKjno6PtFrS2NMRsuCN+JaOyYlUqkVhoEx1WxfTAZ7I8sYUghFzVDmGZ1gs47jLmQI+erifSdq7v0SdI0N3YMiHgEhy1dYm9lB2L0sZq3nkZ9OhzeN/NPPsMOJR2xIbNeQXcLfFbZI5txlWpb5dwm0CJCOTIb7T5MC4Zj3DKCDJVJHRA0sh9ZXNjsbno5mWxyTOfng9oWzI4zhV4I7ZOvUYnTKBNbRNpUqNzmBlPLpo8CiQ7K6SBjItceqlrg3Jt0V1d89WKRMWNjah5Hc/+9r8TjmYle/6rR+rfzjMnR2Ayv0NJAuD",
  region: "us-east-1",
});

async function getDetails() {
  return lambda
    .invoke({
      FunctionName: "cloud-project-get",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({}),
    })
    .promise();

}

async function updateStocks() {
  return lambda
    .invoke({
      FunctionName: "cloud-project-upsert",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        "id": 2,
        "quantity": 2
      }),
    })
    .promise();
}

async function placeOrder() {
  return lambda
    .invoke({
      FunctionName: "cloud-project-put",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        "id": 2,
        "quantity": 2
      }),
    })
    .promise();
}

app.get("/", async (req, res) => {
  try {
    let response = await getDetails();
    res.send({ data: response.Payload, success: true });
  } catch (err) {
    res.send({ error: err, success: false });
  }
});


app.post("/placeOrder", async (req, res) => {
  try {
    await placeOrder();
    let response = await updateStocks();
    res.send({ data: response.Payload, success: true });
  } catch (err) {
    res.send({ error: err, success: false }).status(400);
  }
});


app.listen(3000, () => {
  console.log("listening on port 3000");
});

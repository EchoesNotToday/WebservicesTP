const ip = require("ip");
const {Kafka, CompressionTypes, logLevel} = require("kafkajs");
// ===========================================================
// kafka try
const topic = 'topic-test'
var host = ip.address();
console.log(`Set host value to = ${host}`);
const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    clientId: 'example-producer',
    brokers: [`127.0.0.1:9092`]
})

const getRandomNumber = () => Math.round(Math.random(10) * 1000)
const createMessage = num => ({
    key: `key-${num}`,
    value: `value-${num}-${new Date().toISOString()}`,
})
const producer = kafka.producer();

const sendMessage = () => {
    return producer
        .send({
            topic,
            compression: CompressionTypes.GZIP,
            messages: Array(getRandomNumber())
                .fill()
                .map(_ => createMessage(getRandomNumber())),
        })
        .then(console.log)
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
}
const run = async () => {
    await producer.connect();
    // setInterval(sendMessage, 3000);
    await producer.send({
        topic: topic,
        messages: [
            { key: 'key1', value: 'hello world to Kafka !', partition: 0}
        ]
    });

    await producer.disconnect();
}

async function sendEvent(cart, event) {
    if (cart != null) {
        if (event === 'VALIDATE') {
            let payload = JSON.stringify(cart)
            await producer.connect();
            await producer.send( {
                topic: topic,
                messages: [
                    {
                        key: 'VALIDATE', value: payload, partition: 0
                    }
                ]
            })
            await producer.disconnect();
        }
    }
}

module.exports = {
    sendEvent,
    run
}
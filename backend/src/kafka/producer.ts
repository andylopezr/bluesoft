import { Kafka } from "kafkajs"

const kafka = new Kafka({
  clientId: "softblue-bank",
  brokers: ["localhost:9092"],
})

const producer = kafka.producer()

export const sendMessage = async (topic: string, message: any) => {
  await producer.connect()
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  })
  await producer.disconnect()
}

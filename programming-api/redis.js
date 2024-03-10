import { createClient } from "npm:redis@4.6.13";

export const redis = await connectToRedis()
await waitForRedis()

async function connectToRedis() {
    const redis = createClient({ url: "redis://redis:6379", pingInterval: 1000 })
    redis.on('error', (err) => console.log('Redis Client Error', err))
    await redis.connect()
    return redis
  }

  async function waitForRedis() {
    let loaded = false
  
    while (!loaded) {
      loaded = await isReady()
      if (!loaded) console.log("Redis is loading...")
    }
  
    console.log("Redis is ready!")
  }

  export async function isReady() {
    const info = await redis.info('persistence')
    const lines = info.split('\r\n')
    const loadingLine = lines.find(line => line.startsWith('loading:'))
    const loadingValue = loadingLine.split(':')[1]
    return loadingValue === '0'
  }
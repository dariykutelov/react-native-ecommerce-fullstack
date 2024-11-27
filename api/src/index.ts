import express, { json, urlencoded } from "express"
import serverless from "serverless-http"

import productRouter from "./routes/products/index.js"
import authRouter from "./routes/auth/index.js"
import orderRouter from "./routes/orders/index.js"

const port = 8000
const app = express()
app.use(urlencoded({ extended: true }))
app.use(json())

app.use("/products", productRouter)
app.use("/auth", authRouter)
app.use("/orders", orderRouter)

if (process.env.NODE_ENV == "dev") {
  app.listen(port, () => {
    console.log(`🎯 Ecommerce api listening on port: ${port}!`)
  })
}

export const handler = serverless(app)

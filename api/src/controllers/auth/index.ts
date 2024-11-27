import { Request, Response } from "express"
import { usersTable } from "~/db/userSchema.js"
import bcrypt from "bcryptjs"
import { db } from "../../db/index.js"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"

const generateUserToken = (user: any) => {
  return jwt.sign({ userId: user.id, role: user.role }, "your-secret", {
    expiresIn: "30d"
  })
}

async function registerUser(req: Request, res: Response) {
  try {
    const data = req.validatedBody
    data.password = await bcrypt.hash(data.password, 10)

    const [user] = await db.insert(usersTable).values(data).returning()

    // @ts-ignore
    delete user.password
    const token = generateUserToken(user)

    res.status(201).json({ user, token })
  } catch (e) {
    console.log(e)
    res.status(500).send("Something went wrong")
  }
}

async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.validatedBody

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    if (!user) {
      res.status(401).json({ error: "Authentication failed" })
      return
    }

    const matched = await bcrypt.compare(password, user.password)
    if (!matched) {
      res.status(401).json({ error: "Authentication failed" })
      return
    }

    // create a jwt token
    const token = generateUserToken(user)
    // @ts-ignore
    delete user.password
    res.status(200).json({ user, token })
  } catch (e) {
    res.status(500).send("Something went wrong")
  }
}

export { registerUser, loginUser }

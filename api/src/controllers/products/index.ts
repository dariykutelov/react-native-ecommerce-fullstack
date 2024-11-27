import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import { db } from "../../db/index.js"
import { productsTable } from "../../db/productSchema.js"

async function listProducts(req: Request, res: Response) {
  try {
    const product = await db.select().from(productsTable)
    res.status(200).json(product)
  } catch (error) {
    res.status(500).send(error)
  }
}

async function getProductById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(id)))

    if (!product) {
      res.status(404).send("Product not found")
      return
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(500).send(error)
  }
}

async function createProduct(req: Request, res: Response) {
  try {
    const [product] = await db
      .insert(productsTable)
      .values(req.validatedBody)
      .returning()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).send(error)
  }
}

async function updateProduct(req: Request, res: Response) {
  const { id } = req.params
  const updatedFields = req.validatedBody

  try {
    const [updatedProduct] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, Number(id)))
      .returning()

    if (!updatedProduct) {
      res.status(404).send("Product not found")
      return
    }

    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).send(error)
  }
}
async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params
  try {
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, Number(id)))
      .returning()

    if (!deletedProduct) {
      res.status(404).send("Product not found")
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).send(error)
  }
}
export {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}

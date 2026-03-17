import homeNavigateModel from "../models/homeNavigateSchema.js"

export const getAllNavigationService = async () => {
  try {
    const items = await homeNavigateModel.find().sort({ createdAt: 1 })

    return {
      status: 201,
      json: items
    }

  } catch (err) {

    console.log(err)
    return { status: 500, json: { message: err.message, error: err.message } }
  }
}

export const createNavigationService = async (body) => {
  try {
    const { name, path, isDefault = false } = body
    const item = await homeNavigateModel.create({ name, path, isDefault })
    return { status: 201, json: item }
  } catch (err) {
    console.log(err)
    return { status: 400, json: { message: err.message, error: err.message } }
  }
}

export const deleteNavigationService = async (id) => {
  try {
    const item = await homeNavigateModel.findById(id)

    if (!item) {
      return {
        status: 404,
        json: { message: "Item not found" }
      }
    }

    if (item.isDefault) {
      return {
        status: 400,
        json: { message: "Default item cannot be deleted" }
      }
    }

    await homeNavigateModel.findByIdAndDelete(id)

    return {
      status: 200,
      json: { message: "Item deleted Successfully" }
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      json: {
        message: err.message,
      }
    }
  }
}
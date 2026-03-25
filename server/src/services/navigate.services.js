import navigateModel from "../models/navigateSchema.js"

export const getAllNavigationService = async (userId) => {
  try {
    const items = await navigateModel.find({ owner: userId }).sort({ createdAt: 1 })

    return {
      status: 200,
      json: items
    }

  } catch (err) {

    console.error(err)
    throw { status: 500, json: { message: err.message, error: err.message } }
  }
}

export const createNavigationService = async (body) => {
  try {
    const { name, path, isDefault = false, owner } = body

    const item = await navigateModel.create({ name, path, isDefault, owner })

    return { status: 201, json: item }

  } catch (err) {
    console.error(err)

    throw { status: 400, json: { message: err.message, error: err.message } }
  }
}

export const deleteNavigationService = async (id) => {
  try {
    const item = await navigateModel.findById(id)

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

    await navigateModel.findByIdAndDelete(id)

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
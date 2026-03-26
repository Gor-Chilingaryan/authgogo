import navigateModel from "../models/navigateSchema.js"

export const getAllNavigationService = async (userId) => {
  try {
    const items = await navigateModel
      .find({ owner: userId })
      .sort({ index: 1 })

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

export const updateNavigationService = async (userId, newOrder) => {
  const operations = newOrder.map((id, idx) => ({
    updateOne: {
      filter: { _id: id, owner: userId },
      update: { $set: { index: idx + 1 } },
    }
  }));

  return await navigateModel.bulkWrite(operations);
};

export const addChildNavigationService = async (parentId, childData) => {
  try {
    const updatedItem = await navigateModel.findByIdAndUpdate(
      parentId,
      { $push: { childMenu: childData } },
      { new: true, runValidators: true }
    )
    if (!updatedItem) {
      return { status: 400, json: { message: "Parent not found to add child" } }
    }

    return { status: 200, json: updatedItem }
  } catch (err) {
    return { status: 500, json: { message: err.message } }
  }
}

export const deleteChildNavigationService = async (parentId, childId) => {
  try {
    const updatedItem = await navigateModel.findByIdAndUpdate(
      parentId,
      { $pull: { childMenu: { _id: childId } } },
      { new: true }
    )

    if (!updatedItem) {
      return { status: 404, json: { message: 'Parent item not found' } }
    }
    return { status: 200, json: updatedItem }
  } catch (err) {
    return { status: 500, json: { message: err.message } }
  }
}
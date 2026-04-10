
import mongoose from 'mongoose'
import navItemsModel from '../models/NavItemsSchem.js'

export const getNavItemsService = async (userId) => {
  try {
    const items = await navItemsModel
      .find({ owner: userId, parentId: null })
      .sort({ index: 1 })
      .lean()

    return { status: 200, json: items }
  } catch (err) {
    console.error(err)
    throw { status: 500, json: { message: err.message, error: err.message } }
  }
}

export const createNavItemService = async (body) => {
  try {
    const { title, path, owner } = body
    const item = await navItemsModel.create({ title, path, owner })
    return { status: 201, json: item }
  } catch (err) {
    console.error(err)
    throw { status: 400, json: { message: err.message, error: err.message } }
  }
}

export const deleteNavItemService = async (id) => {
  try {
    const item = await navItemsModel.findById(id)

    if (!item) return { status: 404, json: { message: 'Item not found' } }

    const children = await navItemsModel.find({ parentId: id })
    const childIds = children.map((c) => c._id)
    const grandchildren = childIds.length > 0
      ? await navItemsModel.find({ parentId: { $in: childIds } })
      : []
    const allIds = [item._id, ...childIds, ...grandchildren.map((c) => c._id)]
    await navItemsModel.deleteMany({ _id: { $in: allIds } })

    return { status: 200, json: { message: 'Item deleted Successfully' } }

  } catch (err) {
    console.log(err)

    return { status: 500, json: { message: err.message } }
  }
}


//es ereqy arac chi
export const updateNavigationService = async (userId, newOrder) => {
  const operations = newOrder.map((id, idx) => ({
    updateOne: {
      filter: { _id: id, owner: userId },
      update: { $set: { index: idx + 1 } },
    }
  }))
  return await navItemsModel.bulkWrite(operations)
}

const mapChildMenu = (items = []) => {
  return items.map((item, idx) => ({
    _id: item._id,
    title: item.title,
    path: item.path,
    index: idx + 1,
    childMenu: mapChildMenu(item.childMenu || []),
  }))
}

const getAllTreeIds = (tree) => {
  const ids = []
  const walk = (items = []) => {
    items.forEach((item) => {
      ids.push(String(item._id))
      if (Array.isArray(item.childMenu) && item.childMenu.length) {
        walk(item.childMenu)
      }
    })
  }
  walk(tree)
  return ids
}

export const reorderTreeService = async (userId, tree) => {
  if (!Array.isArray(tree) || tree.length === 0) {
    return { ok: 1 }
  }

  const allIds = getAllTreeIds(tree)
  const uniqueIds = [...new Set(allIds)]
  if (uniqueIds.length !== allIds.length) {
    throw new Error('Tree contains duplicate item ids')
  }

  const ownedCount = await navItemsModel.countDocuments({
    _id: { $in: uniqueIds.map((id) => new mongoose.Types.ObjectId(String(id))) },
    owner: userId,
  })
  if (ownedCount !== uniqueIds.length) {
    throw new Error('Tree contains invalid or unauthorized item ids')
  }

  const operations = []

  const collectOps = (items, parentId) => {
    items.forEach((item, idx) => {
      operations.push({
        updateOne: {
          filter: { _id: item._id, owner: userId },
          update: {
            $set: {
              index: idx + 1,
              parentId: parentId
                ? new mongoose.Types.ObjectId(String(parentId))
                : null,
              childMenu: mapChildMenu(item.childMenu || []),
            },
          },
        },
      })
      if (item.childMenu?.length) {
        collectOps(item.childMenu, item._id)
      }
    })
  }

  collectOps(tree, null)
  console.log('[NAV_REORDER_SERVICE] prepared operations', {
    operationCount: operations.length,
  })

  let txSession = null
  try {
    txSession = await mongoose.startSession()
    let txResult = null
    await txSession.withTransaction(async () => {
      txResult = await navItemsModel.bulkWrite(operations, { session: txSession, ordered: true })
    })
    return txResult
  } catch (error) {
    const message = String(error?.message || '')
    const transactionUnsupported = message.includes('Transaction numbers are only allowed')
      || message.includes('Transaction support')
      || message.includes('replica set')

    if (!transactionUnsupported) {
      throw error
    }

    console.warn('[NAV_REORDER_SERVICE] transaction unsupported, fallback to bulkWrite')
    return await navItemsModel.bulkWrite(operations, { ordered: true })
  } finally {
    if (txSession) {
      await txSession.endSession()
    }
  }
}


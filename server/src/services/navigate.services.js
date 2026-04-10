
import mongoose from 'mongoose'
import navItemsModel from '../models/NavItemsSchem.js'

export const getNavItemsService = async (userId) => {
  try {
    const items = await navItemsModel
      .find({ owner: userId })
      .sort({ position: 1 })
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
    const lastItem = await navItemsModel
      .findOne({ owner })
      .sort({ position: -1 })
      .lean()

    const nextPosition = lastItem?.position ? lastItem.position + 1 : 1
    const item = await navItemsModel.create({
      title,
      path,
      owner,
      parentId: null,
      position: nextPosition,
      depth: 0,
    })
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

    const ownerId = item.owner
    const ordered = await navItemsModel
      .find({ owner: ownerId })
      .sort({ position: 1 })
      .lean()

    const startIndex = ordered.findIndex((it) => String(it._id) === String(id))
    if (startIndex < 0) return { status: 404, json: { message: 'Item not found' } }

    const parentDepth = Number.isFinite(ordered[startIndex]?.depth)
      ? Math.max(0, ordered[startIndex].depth)
      : 0

    let endIndex = startIndex + 1
    while (endIndex < ordered.length) {
      const depth = Number.isFinite(ordered[endIndex]?.depth)
        ? Math.max(0, ordered[endIndex].depth)
        : 0
      if (depth <= parentDepth) break
      endIndex += 1
    }

    const idsToDelete = ordered
      .slice(startIndex, endIndex)
      .map((it) => it._id)

    await navItemsModel.deleteMany({ _id: { $in: idsToDelete }, owner: ownerId })

    return { status: 200, json: { message: 'Item deleted Successfully' } }

  } catch (err) {
    console.log(err)

    return { status: 500, json: { message: err.message } }
  }
}


export const updateNavigationService = async (userId, newOrder) => {
  const operations = newOrder.map((id, idx) => ({
    updateOne: {
      filter: { _id: id, owner: userId },
      update: { $set: { position: idx + 1 } },
    }
  }))
  return await navItemsModel.bulkWrite(operations)
}

export const reorderTreeService = async (userId, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: 1 }
  }

  const allIds = items.map((item) => String(item._id))
  const uniqueIds = [...new Set(allIds)]
  if (uniqueIds.length !== allIds.length) {
    throw new Error('Items contain duplicate ids')
  }

  const ownedCount = await navItemsModel.countDocuments({
    _id: { $in: uniqueIds.map((id) => new mongoose.Types.ObjectId(String(id))) },
    owner: userId,
  })
  if (ownedCount !== uniqueIds.length) {
    throw new Error('Items contain invalid or unauthorized ids')
  }

  const normalizedItems = [...items]
    .map((item, idx) => ({
      ...item,
      position: Number.isFinite(Number(item.position)) ? Number(item.position) : idx + 1,
      depth: Number.isFinite(Number(item.depth)) ? Math.max(0, Number(item.depth)) : 0,
    }))
    .sort((a, b) => a.position - b.position)

  const withParents = normalizedItems.map((item, index) => {
    if (item.depth === 0) return { ...item, parentId: null }

    let parentId = null
    let bestDepth = -1
    for (let i = index - 1; i >= 0; i -= 1) {
      const prevDepth = normalizedItems[i].depth
      if (prevDepth < item.depth) {
        parentId = normalizedItems[i]._id
        bestDepth = prevDepth
        if (prevDepth === item.depth - 1) break
      }
    }

    return {
      ...item,
      depth: bestDepth >= 0 ? item.depth : 0,
      parentId: bestDepth >= 0 ? parentId : null,
    }
  })

  const operations = withParents.map((item, idx) => {
    const payloadPosition = Number(item.position)
    const payloadDepth = Number(item.depth)

    return {
      updateOne: {
        filter: { _id: item._id, owner: userId },
        update: {
          $set: {
            position: Number.isFinite(payloadPosition) ? payloadPosition : idx + 1,
            depth: Number.isFinite(payloadDepth) ? Math.max(0, payloadDepth) : 0,
            parentId: item.parentId ? new mongoose.Types.ObjectId(String(item.parentId)) : null,
          },
        },
      },
    }
  })
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
    if (txResult?.matchedCount !== operations.length) {
      throw new Error('Not all items were updated', {
        cause: new Error(
          `Matched ${txResult?.matchedCount ?? 0} of ${operations.length} updates`
        ),
      })
    }
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
    const fallbackResult = await navItemsModel.bulkWrite(operations, { ordered: true })
    if (fallbackResult?.matchedCount !== operations.length) {
      throw new Error('Not all items were updated', {
        cause: error,
      })
    }
    return fallbackResult
  } finally {
    if (txSession) {
      await txSession.endSession()
    }
  }
}


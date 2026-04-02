/**
 * Module: navigateSchema.js
 * Description: Mongoose schema for per-user navigation menus, including nested child links and display ordering.
 * Role in request lifecycle: Persistence layer — navigation services perform CRUD and reorder operations against this model.
 */
import mongoose from 'mongoose'

const childMenuSchema = new mongoose.Schema({
  index: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },

})


const navigateSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  index: {
    type: Number
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
  childMenu: {
    type: [childMenuSchema],
    default: [],
  }
})

// Unique per owner: prevents duplicate paths/names in the same user's menu (application-level data integrity).
navigateSchema.index({ owner: 1, path: 1 }, { unique: true });
navigateSchema.index({ owner: 1, name: 1 }, { unique: true });

/**
 * On create, assigns the next sequential `index` for this owner by reading the highest existing index.
 * @param {import('mongoose').CallbackWithoutResultAndOptionalError} next - Mongoose middleware continuation.
 * @returns {Promise<void>}
 * @throws {Error} Propagates query errors from `findOne` (e.g. DB unavailable).
 */
navigateSchema.pre('save', async function () {
  if (this.isNew) {

    const lastItem = await this.constructor
      .findOne({ owner: this.owner })
      .sort({ index: -1 })

    this.index = lastItem && lastItem.index ? lastItem.index + 1 : 1

  }
})

const navigateModel = mongoose.model('Navigate', navigateSchema)

export default navigateModel

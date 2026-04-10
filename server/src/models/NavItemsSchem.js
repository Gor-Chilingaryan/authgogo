import mongoose from 'mongoose'

const { Schema } = mongoose

const NavItemsSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'NavItem',
      default: null,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    path: {
      type: String,
      default: '',
      trim: true,
    },

    position: {
      type: Number,
      required: true,
      default: 100,
      index: true,
    },

    depth: {
      type: Number,
      default: 0,
      min: 0,
    },

    ancestors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'NavItem',
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

NavItemsSchema.index({ parentId: 1, position: 1 })
NavItemsSchema.index({ ancestors: 1 })

const navItemsModel = mongoose.model('NavItems', NavItemsSchema)

export default navItemsModel
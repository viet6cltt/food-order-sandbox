const fs = require('fs')
const path = require('path')

let RestaurantModel = null
try {
  RestaurantModel = require('../models/Restaurant')
} catch (e) {
  // model not available or fails to load — fallback to sample data
  RestaurantModel = null
}

/**
 * Get restaurants with limit & offset
 * @param {Object} opts
 * @param {number} opts.limit
 * @param {number} opts.offset
 * @returns {Promise<{items: Array, total: number}>}
 */
async function getAll({ limit = 16, offset = 0 } = {}) {
  if (RestaurantModel && typeof RestaurantModel.find === 'function') {
    // Use mongoose model
    const [items, total] = await Promise.all([
      RestaurantModel.find().skip(offset).limit(limit).lean(),
      RestaurantModel.countDocuments(),
    ])
    // map _id to id string
    const mapped = items.map(item => {
      return Object.assign({}, item, { id: (item._id ? String(item._id) : undefined) })
    })
    return { items: mapped, total }
  }

  // Fallback: read sample file
  try {
    const sampleFile = path.join(process.cwd(), 'public', 'sample_restaurants_data.json')
    const raw = fs.readFileSync(sampleFile, 'utf8')
    const all = JSON.parse(raw)
    const total = Array.isArray(all) ? all.length : 0
    const slice = Array.isArray(all) ? all.slice(offset, offset + limit) : []
    const mapped = slice.map((item, idx) => {
      // support documents with _id.$oid or _id
      const id =
        item && item._id && item._id.$oid
          ? String(item._id.$oid)
          : item && item._id
          ? String(item._id)
          : item && item.id
          ? String(item.id)
          : String(offset + idx + 1)
      return Object.assign({}, item, { id })
    })
    return { items: mapped, total }
  } catch (err) {
    // On any error, return empty result (controller will handle)
    return { items: [], total: 0 }
  }
}

async function getById(restaurantId) {
  if (RestaurantModel && typeof RestaurantModel.findById === 'function') {
    // Use mongoose model
    const restaurant = await RestaurantModel.findById(restaurantId).lean();
    if (!restaurant) {
      return null;
    }
    // map _id to id string
    return Object.assign({}, restaurant, { 
      id: restaurant._id ? String(restaurant._id) : undefined 
    });
  }

  // Fallback: read sample file
  try {
    const sampleFile = path.join(process.cwd(), 'public', 'sample_restaurants_data.json')
    const raw = fs.readFileSync(sampleFile, 'utf8')
    const all = JSON.parse(raw)
    const found = Array.isArray(all) 
      ? all.find(item => {
          const id = item && item._id && item._id.$oid
            ? String(item._id.$oid)
            : item && item._id
            ? String(item._id)
            : item && item.id
            ? String(item.id)
            : null
          return id === String(restaurantId)
        })
      : null
    
    if (!found) {
      return null;
    }

    const id = found && found._id && found._id.$oid
      ? String(found._id.$oid)
      : found && found._id
      ? String(found._id)
      : found && found.id
      ? String(found.id)
      : String(restaurantId)
    
    return Object.assign({}, found, { id })
  } catch (err) {
    // On any error, return null
    return null
  }
}

module.exports = { getAll, getById }
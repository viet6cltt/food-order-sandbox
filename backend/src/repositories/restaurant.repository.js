// Simple repository returning mock restaurants for now.
// Replace with DB queries (e.g., Mongoose) when model is available.

const PLACEHOLDER = 'https://via.placeholder.com/640x360.png?text=Restaurant'

function generateMock(count = 32) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Restaurant ${i + 1}`,
    address: `Some street ${i + 1}, City`,
    rating: Math.round((3 + Math.random() * 2) * 10) / 10,
    bannerUrl: `${PLACEHOLDER}+${i + 1}`,
  }))
}

exports.getAll = async ({ limit = 100, offset = 0 } = {}) => {
  const all = generateMock(64)
  return all.slice(offset, offset + limit)
}

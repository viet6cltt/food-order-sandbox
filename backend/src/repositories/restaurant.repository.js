// Simple repository returning mock restaurants for now.
// Replace with DB queries (e.g., Mongoose) when model is available.

const PLACEHOLDER = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.canva.com%2Fbanners%2Ftemplates%2Frestaurant%2F&psig=AOvVaw0djnBdqyiHWvBJB5OOh9_-&ust=1763197860001000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJCZq4Wm8ZADFQAAAAAdAAAAABAE'

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

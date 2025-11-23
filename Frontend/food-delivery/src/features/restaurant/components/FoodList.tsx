import React from 'react'
import FoodItemComponent, { type MenuItemDto } from './FoodItem'

export type FoodListItem = {
  id: string
  name: string
  price: number
  imageUrl?: string
  description?: string
  rating?: number
}

interface FoodListProps {
  items: FoodListItem[]
  className?: string
  onSelect?: (item: FoodListItem) => void
  onAdd?: (payload: { itemId?: string; qty: number }) => void
}

const FoodList: React.FC<FoodListProps> = ({ items, className = '', onSelect, onAdd }) => {
  if (!items || items.length === 0) {
    return <div className={`${className} py-6 text-center text-sm text-gray-500`}>No foods found.</div>
  }

  return (
    <div className={`${className} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`}>
      {items.map((f) => {
        const dto: MenuItemDto = { _id: f.id, name: f.name, price: f.price, imageUrl: f.imageUrl, description: f.description, rating: f.rating }
        return (
          <FoodItemComponent
            key={f.id}
            compact
            data={dto}
            onSelect={(mi) => onSelect && onSelect({ id: mi._id, name: mi.name, price: mi.price, imageUrl: mi.imageUrl, description: mi.description, rating: mi.rating })}
            onAdd={onAdd}
          />
        )
      })}
    </div>
  )
}

export default FoodList;

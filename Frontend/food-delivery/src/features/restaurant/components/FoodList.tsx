import React from 'react'
import FoodItemComponent, { type MenuItemDto } from './FoodItem'

interface FoodListProps {
  items: MenuItemDto[]
  className?: string
  onSelect?: (item: MenuItemDto) => void
  onAdd?: (payload: { itemId?: string; qty: number }) => void
}

const FoodList: React.FC<FoodListProps> = ({ items, className = '', onSelect, onAdd }) => {
  if (!items || items.length === 0) {
    return <div className={`${className} py-6 text-center text-sm text-gray-500`}>No foods found.</div>
  }

  return (
    <div className={`${className} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`}>
      {items.map((item) => (
        <FoodItemComponent
          key={item._id}
          compact
          data={item}
          onSelect={(mi) => onSelect && onSelect(mi)}
          onAdd={onAdd}
        />
      ))}
    </div>
  )
}

export default FoodList;

import React from 'react'
import { Order } from '../types'

interface Props {
  order:   Order
  isLast:  boolean
  onClick: () => void
}

export default function OrderCard({ order, isLast, onClick }: Props) {
  const isNew = order.status === 'NEW'
  const isDelivered = order.status === 'DELIVERED' || order.status === 'CLOSED'

  const timeAgo = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (mins < 1)  return 'just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  }

  const isUrgent = () => {
    const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)
    return mins > 10 && !isDelivered
  }

  const itemsSummary = order.items
    .map(i => `${i.name} ×${i.quantity}`)
    .join(', ')

  return (
    <div
      onClick={onClick}
      style={{
        display:             'grid',
        gridTemplateColumns: '80px 1fr 2fr 100px 80px',
        padding:             '14px 20px',
        borderBottom:        isLast ? 'none' : '1px solid #f5f5f5',
        cursor:              'pointer',
        alignItems:          'center',
        backgroundColor:     isUrgent() ? '#fffbeb' : '#ffffff',
        transition:          'background 0.15s',
        borderLeft:          isNew ? '3px solid #ef4444' : isDelivered ? '3px solid #22c55e' : '3px solid transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = isUrgent() ? '#fef9e7' : '#fafafa'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = isUrgent() ? '#fffbeb' : '#ffffff'}
    >
      {/* Order Number */}
      <div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>#{order.orderNumber}</span>
        {isNew && (
          <span style={{
            display:         'block',
            fontSize:        9,
            fontWeight:      700,
            color:           '#dc2626',
            textTransform:   'uppercase',
            letterSpacing:   0.5,
            marginTop:       2
          }}>
            New
          </span>
        )}
      </div>

      {/* Customer */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0 }}>
          {order.customerName}
        </p>
        <p style={{ fontSize: 11, color: '#999', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
          📍 {order.deliveryAddress}
        </p>
      </div>

      {/* Items */}
      <div>
        <p style={{
          fontSize:     12,
          color:        '#555',
          margin:       0,
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          maxWidth:     280
        }}>
          {itemsSummary}
        </p>
        {order.specialRequests && (
          <p style={{ fontSize: 11, color: '#d97706', margin: '2px 0 0' }}>
            ⚠️ {order.specialRequests}
          </p>
        )}
      </div>

      {/* Total */}
      <div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
          Rs {order.totalAmount.toLocaleString()}
        </span>
      </div>

      {/* Time */}
      <div>
        <span style={{
          fontSize:  12,
          color:     isUrgent() ? '#d97706' : '#999',
          fontWeight: isUrgent() ? 600 : 400
        }}>
          {timeAgo(order.createdAt)}
        </span>
      </div>
    </div>
  )
}
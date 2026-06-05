import React from 'react'
import { Order } from '../types'

interface Props {
  order:            Order
  onClose:          () => void
  onMarkDelivered:  (orderId: string) => void
}

export default function OrderDetail({ order, onClose, onMarkDelivered }: Props) {
  const isDelivered = order.status === 'DELIVERED' || order.status === 'CLOSED'

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month:  'short',
      day:    'numeric',
      hour:   '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(0,0,0,0.35)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        zIndex:          1000,
        padding:         24,
        backdropFilter:  'blur(2px)'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius:    16,
          width:           '100%',
          maxWidth:        460,
          maxHeight:       '88vh',
          overflowY:       'auto',
          boxShadow:       '0 20px 60px rgba(0,0,0,0.15)'
        }}
      >
        {/* Header */}
        <div style={{
          padding:        '20px 24px 16px',
          borderBottom:   '1px solid #f0f0f0',
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-start'
        }}>
          <div>
            <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Order
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0 }}>
              #{order.orderNumber}
            </h2>
            <p style={{ fontSize: 12, color: '#bbb', margin: '4px 0 0' }}>
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              padding:         '5px 12px',
              borderRadius:    20,
              fontSize:        11,
              fontWeight:      700,
              textTransform:   'uppercase',
              letterSpacing:   0.5,
              backgroundColor: isDelivered ? '#f0fdf4' : '#fff7ed',
              color:           isDelivered ? '#16a34a' : '#ea580c',
              border:          isDelivered ? '1px solid #bbf7d0' : '1px solid #fed7aa'
            }}>
              {isDelivered ? 'Delivered' : 'Pending'}
            </span>
            <button
              onClick={onClose}
              style={{
                background:   '#f5f5f5',
                border:       'none',
                width:        30,
                height:       30,
                borderRadius: '50%',
                cursor:       'pointer',
                fontSize:     16,
                color:        '#666',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Customer */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Customer Details
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14 }}>👤</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{order.customerName}</span>
              </div>
              {order.customerPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>📞</span>
                  <span style={{ fontSize: 13, color: '#555' }}>{order.customerPhone}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>📍</span>
                <span style={{ fontSize: 13, color: '#555', lineHeight: 1.4 }}>{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#f0f0f0' }} />

          {/* Items */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Order Items
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  padding:        '10px 14px',
                  backgroundColor: '#f8f9fa',
                  borderRadius:   8
                }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{item.name}</span>
                    <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>× {item.quantity}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              padding:        '12px 14px 0',
              marginTop:      4
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>
                Rs {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Special Requests */}
          {order.specialRequests && (
            <div style={{
              padding:         '12px 14px',
              backgroundColor: '#fffbeb',
              borderRadius:    8,
              border:          '1px solid #fde68a'
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                Special Requests
              </p>
              <p style={{ fontSize: 13, color: '#b45309', margin: 0 }}>{order.specialRequests}</p>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: '#f0f0f0' }} />

          {/* Audit Trail */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Audit Trail
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {order.statusHistory
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((event, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{
                      fontSize:   11,
                      color:      '#bbb',
                      minWidth:   70,
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {new Date(event.createdAt).toLocaleTimeString('en-US', {
                        hour:   '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <div style={{
                      width:           6,
                      height:          6,
                      borderRadius:    '50%',
                      backgroundColor: '#d1d5db',
                      flexShrink:      0
                    }} />
                    <span style={{ fontSize: 12, color: '#666' }}>
                      {event.toStatus.replace(/_/g, ' ')}
                      {event.changedBy !== 'system' && (
                        <span style={{ color: '#bbb' }}> · {event.changedBy}</span>
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Button */}
          {!isDelivered && (
            <button
              onClick={() => onMarkDelivered(order.id)}
              style={{
                width:           '100%',
                padding:         '14px 0',
                backgroundColor: '#111',
                color:           '#fff',
                border:          'none',
                borderRadius:    10,
                fontSize:        14,
                fontWeight:      700,
                cursor:          'pointer',
                marginTop:       4,
                letterSpacing:   0.3
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111'}
            >
              Mark as Delivered ✓
            </button>
          )}

          {isDelivered && (
            <div style={{
              width:           '100%',
              padding:         '14px 0',
              backgroundColor: '#f0fdf4',
              border:          '1px solid #bbf7d0',
              borderRadius:    10,
              fontSize:        14,
              fontWeight:      600,
              color:           '#16a34a',
              textAlign:       'center'
            }}>
              ✓ Order Delivered
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
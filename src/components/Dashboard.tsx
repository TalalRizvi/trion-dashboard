import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Order, OrderStatus } from '../types'
import OrderCard from './OrderCard'
import OrderDetail from './OrderDetail'

const TENANT_ID = process.env.REACT_APP_TENANT_ID!
const API_URL   = process.env.REACT_APP_API_URL!

type FilterType = 'PENDING' | 'DELIVERED'

export default function Dashboard() {
  const [orders, setOrders]               = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter]               = useState<FilterType>('PENDING')
  const [loading, setLoading]             = useState(true)

  const fetchOrders = async () => {
    try {
      const res  = await fetch(`${API_URL}/tools/orders/${TENANT_ID}`)
      const data = await res.json()
      if (data.success) setOrders(data.orders)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event:  '*',
        schema: 'public',
        table:  'Order',
        filter: `tenantId=eq.${TENANT_ID}`
      }, () => fetchOrders())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const markDelivered = async (orderId: string) => {
    try {
      await fetch(`${API_URL}/tools/orders/${orderId}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: 'DELIVERED', changedBy: 'cashier' })
      })
      await fetchOrders()
      setSelectedOrder(null)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const PENDING_STATUSES: OrderStatus[] = ['NEW', 'CONFIRMED', 'IN_KITCHEN', 'READY', 'DISPATCHED']
  const DELIVERED_STATUSES: OrderStatus[] = ['DELIVERED', 'CLOSED']

  const pendingOrders   = orders.filter(o => PENDING_STATUSES.includes(o.status))
  const deliveredOrders = orders.filter(o => DELIVERED_STATUSES.includes(o.status))
  const totalRevenue    = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const filteredOrders  = filter === 'PENDING' ? pendingOrders : deliveredOrders
  const newOrders       = orders.filter(o => o.status === 'NEW').length

  if (loading) return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      height:         '100vh',
      background:     '#f7f8fa'
    }}>
      <p style={{ color: '#888', fontSize: 14 }}>Loading orders...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <div style={{
        background:   '#ffffff',
        borderBottom: '1px solid #eaeaea',
        padding:      '0 32px',
        display:      'flex',
        alignItems:   'center',
        height:       64,
        gap:          12
      }}>
        <span style={{ fontSize: 22 }}>🍗</span>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>KFC Orders</h1>
          <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Order Management Dashboard</p>
        </div>
        {newOrders > 0 && (
          <div style={{
            marginLeft:      'auto',
            backgroundColor: '#fee2e2',
            color:           '#dc2626',
            padding:         '4px 12px',
            borderRadius:    20,
            fontSize:        12,
            fontWeight:      600,
            display:         'flex',
            alignItems:      'center',
            gap:             6
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} />
            {newOrders} new {newOrders === 1 ? 'order' : 'orders'}
          </div>
        )}
      </div>

      <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Orders',     value: orders.length,          color: '#6366f1', bg: '#eef2ff', icon: '📦' },
            { label: 'Pending',          value: pendingOrders.length,   color: '#f59e0b', bg: '#fffbeb', icon: '🟡' },
            { label: 'Delivered',        value: deliveredOrders.length, color: '#22c55e', bg: '#f0fdf4', icon: '✅' },
            { label: 'Total Revenue',    value: `Rs ${totalRevenue.toLocaleString()}`, color: '#0ea5e9', bg: '#f0f9ff', icon: '💰' },
          ].map((stat, i) => (
            <div key={i} style={{
              background:   '#ffffff',
              borderRadius: 12,
              padding:      '18px 20px',
              border:       '1px solid #eaeaea',
              boxShadow:    '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {stat.label}
                </span>
                <span style={{
                  fontSize:        16,
                  backgroundColor: stat.bg,
                  padding:         '4px 6px',
                  borderRadius:    6
                }}>
                  {stat.icon}
                </span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#111', margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          marginBottom: 16,
          gap:          8
        }}>
          {(['PENDING', 'DELIVERED'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:         '8px 20px',
                borderRadius:    8,
                border:          filter === f ? 'none' : '1px solid #e5e7eb',
                backgroundColor: filter === f ? '#111' : '#ffffff',
                color:           filter === f ? '#ffffff' : '#666',
                fontSize:        13,
                fontWeight:      600,
                cursor:          'pointer',
                transition:      'all 0.15s'
              }}
            >
              {f === 'PENDING' ? `Pending (${pendingOrders.length})` : `Delivered (${deliveredOrders.length})`}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div style={{
          background:   '#ffffff',
          borderRadius: 12,
          border:       '1px solid #eaeaea',
          overflow:     'hidden',
          boxShadow:    '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {/* Table Header */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: '80px 1fr 2fr 100px 80px',
            padding:             '12px 20px',
            borderBottom:        '1px solid #f0f0f0',
            backgroundColor:     '#fafafa'
          }}>
            {['Order', 'Customer', 'Items', 'Total', 'Time'].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {h}
              </span>
            ))}
          </div>

          {/* Orders */}
          {filteredOrders.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>
                {filter === 'PENDING' ? '🎉' : '📭'}
              </p>
              <p style={{ color: '#999', fontSize: 14 }}>
                {filter === 'PENDING' ? 'No pending orders' : 'No delivered orders yet'}
              </p>
            </div>
          ) : (
            filteredOrders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order, i) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isLast={i === filteredOrders.length - 1}
                  onClick={() => setSelectedOrder(order)}
                />
              ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onMarkDelivered={markDelivered}
        />
      )}
    </div>
  )
}
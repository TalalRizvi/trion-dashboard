export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'IN_KITCHEN'
  | 'READY'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CLOSED'
  | 'ISSUE'

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface StatusEvent {
  id: string
  orderId: string
  fromStatus: string
  toStatus: string
  changedBy: string
  notes: string | null
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: number
  tenantId: string
  customerName: string
  customerPhone: string | null
  deliveryAddress: string
  items: OrderItem[]
  totalAmount: number
  specialRequests: string | null
  callId: string | null
  transcript: string | null
  status: OrderStatus
  statusHistory: StatusEvent[]
  createdAt: string
  updatedAt: string
}
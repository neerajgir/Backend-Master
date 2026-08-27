import { io } from 'socket.io-client'
import { API_URL } from './api'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_URL.replace(/\/api\/v1\/?$/, '')

let socket = null

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false })
  }
  return socket
}

export const connectSocket = () => {
  const instance = getSocket()
  if (!instance.connected) instance.connect()
  return instance
}

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect()
}

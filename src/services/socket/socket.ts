import { Socket, io } from 'socket.io-client'

export const sockets = {
  closeConnection() {
    this.socket.disconnect()
  },
  socket: null as unknown as Socket,
  socketInit(token: string | undefined) {
    if (token) {
      const queryParams = {
        query: {
          accessToken: token,
        },
      }

      this.socket = io('https://inctagram.work', queryParams)
      this.socket.on('connect', () => {
        console.log('websocket has been connected')
      })
    }
  },
}

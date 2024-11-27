import { inctagramService } from '@/services/inctagram.service'

export const inctagramNotificationsService = inctagramService.injectEndpoints({
  endpoints: builder => {
    return {
      deleteNotificationById: builder.mutation<void, number>({
        invalidatesTags: ['getNotifications'],
        query: id => {
          return { method: 'DELETE', url: `/v1/notifications/${id}` }
        },
      }),
      getNotifications: builder.query<ResponseGetNotifications, RequestGetNotifications>({
        providesTags: ['getNotifications'],
        query: args => {
          return { method: 'GET', params: args.params, url: `/v1/notifications/${args.cursor}` }
        },
      }),
      markNotificationAsRead: builder.mutation<void, RequestMarkNotificationAsRead>({
        invalidatesTags: ['getNotifications'],
        query: body => {
          return { body, method: 'PUT', url: `/v1/notifications/mark-as-read` }
        },
      }),
    }
  },
})

export const {
  useDeleteNotificationByIdMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = inctagramNotificationsService

type RequestGetNotifications = {
  cursor?: number
  params: {
    pageSize?: number
    sortBy?: string
    sortDirection?: string
  }
}
export type NotificationItemType = {
  createdAt: string
  id: number
  isRead: boolean
  message: string
  notifyAt: string
}
type ResponseGetNotifications = {
  items: NotificationItemType[]
  notReadCount: number
  pageSize: number
  totalCount: number
}

type RequestMarkNotificationAsRead = {
  ids: number[]
}

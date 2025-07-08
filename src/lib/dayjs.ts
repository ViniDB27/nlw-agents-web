import dayjsLib from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjsLib.locale('pt-BR')
dayjsLib.extend(relativeTime)

export const dayjs = dayjsLib


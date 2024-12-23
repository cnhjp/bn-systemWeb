export namespace DateUtil {
    /**
     * 日期格式化函数
     * @param date 时间戳或者date对象
     * @param format 格式化格式，例如 yyyy-MM-dd
     */
    export const formatDate = (date: any, format?: DateFormat | string) => {
        if (!date) return
        if (!format) {
            format = 'yyyy-MM-dd'
        }
        if (date instanceof Date) {
            const dict: any = {
                yyyy: date.getFullYear(),
                M: date.getMonth() + 1,
                H: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds(),
                MM: ('' + (date.getMonth() + 101)).slice(1),
                dd: ('' + (date.getDate() + 100)).slice(1),
                HH: ('' + (date.getHours() + 100)).slice(1),
                mm: ('' + (date.getMinutes() + 100)).slice(1),
                ss: ('' + (date.getSeconds() + 100)).slice(1),
            }
            return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
                // eslint-disable-next-line prefer-rest-params
                return dict[arguments[0]]
            })
        }
    }

    export const toDate = (date: string): Date => {
        return new Date(date?.replace(/-/g, '/'))
    }

    export enum DateFormat {
        yyyyMM = 'yyyy-MM',
        yyyyMMdd = 'yyyy-MM-dd',
        yyyyMMddHH = 'yyyy-MM-dd HH',
        yyyyMMddHHmm = 'yyyy-MM-dd HH:mm',
        yyyyMMddHHmmss = 'yyyy-MM-dd HH:mm:ss',
        yyyyMMddhh = 'yyyy-MM-dd hh',
        yyyyMMddhhmm = 'yyyy-MM-dd hh:mm',
        yyyyMMddhhmmss = 'yyyy-MM-dd hh:mm:ss',
    }
}

import moment from "moment-timezone";

export const DEFAULT_EMAIL = "samokatim@internet.ru"


export const DaysOfWeek = {
    MONDAY: 'Понедельник',
    TUESDAY: 'Вторник',
    WEDNESDAY: 'Среда',
    THURSDAY: 'Четверг',
    FRIDAY: 'Пятница',
    SATURDAY: 'Суббота',
    SUNDAY: 'Воскресенье'
}

export const ShortDaysOfWeek = {
    MONDAY: 'Пн',
    TUESDAY: 'Вт',
    WEDNESDAY: 'Ср',
    THURSDAY: 'Чт',
    FRIDAY: 'Пт',
    SATURDAY: 'Сб',
    SUNDAY: 'Вс'
}
export const toDayName = (dayOfWeek) => {
    switch (dayOfWeek) {
        case 'MONDAY':
            return 'Понедельник';
        case 'TUESDAY':
            return 'Вторник';
        case 'WEDNESDAY':
            return 'Среда';
        case 'THURSDAY':
            return 'Четверг';
        case 'FRIDAY':
            return 'Пятница';
        case 'SATURDAY':
            return 'Суббота';
        case 'SUNDAY':
            return 'Воскресенье';
        default:
            return undefined;
    }
}

export const currentTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export const toLocalTime = (value) => {
    return moment(value, 'HH:mm:ss.SSSZ').tz(currentTimezone()).format('HH:mm')
}

export const toOffsetTime = (value) => {
    return moment(value, 'HH:mm').tz(currentTimezone()).format('HH:mm:ss.SSSZ');
}

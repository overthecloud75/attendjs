export const pagesInfo = {
    'dashboard': {
        to: '/dashboard',
        emoji: '📊',
        title: 'Dashboard',
        auth: true,
        visible: true
    },
    'attend': {
        to: '/attend',
        emoji: '🕒',
        title: 'Attend',
        auth: true,
        visible: true
    },
    'wifi-attend': {
        to: '/wifi-attend',
        emoji: '📶',
        title: 'Wifi-Attend',
        auth: false,
        visible: false
    },
    'gps-attend': {
        to: '/gps-attend',
        emoji: '📍',
        title: 'GPS-Attend',
        auth: true,
        visible: true
    },
    'employee': {
        to: '/employee',
        emoji: '👥',
        title: 'Employee',
        auth: true,
        visible: true
    },
    'meetings': {
        to: '/meetings',
        emoji: '📅',
        title: 'Meetings',
        auth: true,
        visible: true
    },
    'device': {
        to: '/device',
        emoji: '💻',
        title: 'Device',
        auth: true,
        visible: true
    },
    'creditcard': {
        to: '/creditcard',
        emoji: '💳',
        title: 'CreditCard',
        auth: true,
        visible: true
    },
    'approval': {
        to: '/approvalhistory',
        emoji: '✔️',
        title: 'ApprovalHistory',
        auth: true,
        visible: true
    },
    'board': {
        to: '/board',
        emoji: '📋',
        title: 'Board',
        auth: true,
        visible: true
    },
    'summary': {
        to: '/summary',
        emoji: '📄',
        title: 'Summary',
        auth: false,
        visible: true
    },
    'location': {
        to: '/admin/settings/location',
        emoji: '📌',
        title: 'Location',
        auth: false,
        visible: true
    },
    'settings': {
        to: '/admin/settings',
        emoji: '⚙️',
        title: 'Settings',
        auth: false,
        visible: true
    },
    'loginhistory': {
        to: '/loginhistory',
        emoji: '🔐',
        title: 'LoginHistory',
        auth: false,
        visible: true
    }
}
export const UserEditablePages = ['board', 'creditcard']
export const AdminEditablePages = ['location', 'employee', 'board', 'creditcard']
export const UpdatablePages = ['location', 'device', 'employee', 'approval', 'creditcard']
export const AdminEditableTitles = ['info', 'type', 'location', 'charge', 'beginDate', 'email', 'mobileNo', 'department', 'rank', 'position', 'regular', 'mode', 'attendMode', 'latitude', 'longitude', 'dev', 'status', 'cardNo']
export const UserEditableTitles = ['info', 'type', 'location', 'charge', 'status']
export const EditableSelects = ['position', 'regular', 'mode', 'attendMode', 'status']
export const CardEditableTitles = ['price', 'people']
export const CardEditableSelects = ['use']
export const SearchPages = ['attend', 'wifi-attend', 'gps-attend', 'summary', 'device', 'creditcard', 'loginhistory', 'approval', 'board']
export const SearchMonthPages = ['summary', 'creditcard', 'approval', 'board']


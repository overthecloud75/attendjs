import { 
    LayoutDashboard, Bot, Clock, Wifi, MapPin, Users, Calendar, 
    Laptop, CreditCard, CheckCircle, ClipboardList, FileText, Settings, ShieldCheck 
} from 'lucide-react'

export const pagesInfo = {
    'dashboard': {
        id: 'dashboard',
        to: '/dashboard',
        icon: LayoutDashboard,
        auth: true,
        visible: true
    },
    'agentic-smartwork': {
        id: 'agentic-smartwork',
        to: '/agentic-canvas',
        icon: Bot,
        auth: true,
        visible: true
    },
    'attend': {
        id: 'attend',
        to: '/attend',
        icon: Clock,
        auth: true,
        visible: true
    },
    'wifi': {
        id: 'wifi',
        to: '/wifi',
        icon: Wifi,
        auth: false,
        visible: false
    },
    'gps': {
        id: 'gps',
        to: '/gps',
        icon: MapPin,
        auth: true,
        visible: true
    },
    'employee': {
        id: 'employee',
        to: '/employee',
        icon: Users,
        auth: true,
        visible: true
    },
    'meetings': {
        id: 'meetings',
        to: '/meetings',
        icon: Calendar,
        auth: true,
        visible: true
    },
    'device': {
        id: 'device',
        to: '/device',
        icon: Laptop,
        auth: true,
        visible: true
    },
    'creditcard': {
        id: 'creditcard',
        to: '/creditcard',
        icon: CreditCard,
        auth: true,
        visible: true
    },
    'approval': {
        id: 'approval',
        to: '/approvalhistory',
        icon: CheckCircle,
        auth: true,
        visible: true
    },
    'board': {
        id: 'board',
        to: '/board',
        icon: ClipboardList,
        auth: true,
        visible: true
    },
    'summary': {
        id: 'summary',
        to: '/summary',
        icon: FileText,
        auth: false,
        visible: true,
        apiPath: '/api/summary/leftleavelist'
    },
    'location': {
        id: 'location',
        to: '/admin/settings/location',
        icon: MapPin,
        auth: false,
        visible: true
    },
    'settings': {
        id: 'settings',
        to: '/admin/settings',
        icon: Settings,
        auth: false,
        visible: true
    },
    'loginhistory': {
        id: 'loginhistory',
        to: '/loginhistory',
        icon: ShieldCheck,
        auth: false,
        visible: true,
        apiPath: '/api/auth/search'
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
export const SearchPages = ['attend', 'wifi', 'gps', 'summary', 'device', 'creditcard', 'loginhistory', 'approval', 'board']
export const SearchMonthPages = ['summary', 'creditcard', 'approval', 'board']

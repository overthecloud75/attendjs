export const WORKING = {
    time: {beginTime: '100000', lunchTime: '123000', lunchFinishTime: '133000', overNight: '040000'},
    inStatus: ['미출근', '정상출근', '지각'],
    outStatus: {
        '휴가': ['연차', '휴가', '월차'], 
        '반차': ['반차'], 
        '외근': ['출장', '설명회', '미팅', '평가', '외근', '정기점검'],
        '파견': ['파견'],
        '재택': ['재택'],
        '기타': ['기타']
    }, 
    update: ['상근', '병특'],
    status: {연차: 0, 휴가: 0, 월차: 0, 반차: 4, 출장: 8, 설명회: 8, 미팅: 8, 평가: 8,
             외근: 8, 파견: 8, 재택: 8, 정기점검: 8, 출근: 8, 기타: 8},
    offDay: {연차: 1, 휴가: 1, 월차: 1, 반차: 0.5, 지각: 0.25, 미출근: 1},
    holidays: ['0301', '0501', '0505', '0606', '0717', '0815', '1003', '1009', '1225'],
    specialHolidays: ['선거'],
    lunarHolidays: ['0101', '0102', '0408', '0814', '0815', '0816'],
    alternativeVacation: ['0301', '0505', '0815', '1003', '1009']
}

export const attendColumnHeaders = [
    {
        accessor: 'employeeId',
        Header: 'ID',
    },
    {
        accessor: 'name',
        Header: 'Name',
    },
    {
        accessor: 'date',
        Header: 'Date',
    },
    {
        accessor: 'begin',
        Header: 'Begin',
    },
    {
        accessor: 'end',
        Header: 'End',
    },
    {
        accessor: 'workingHours',
        Header: 'WorkingHours',
    },
    {
        accessor: 'status',
        Header: 'Status',
    },
    {
        accessor: 'reason',
        Header: 'Reason',
    },
]

export const attendCsvHeaders = [
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'date',
        label: 'Date',
    },
    {
        key: 'begin',
        label: 'Begin',
    },
    {
        key: 'end',
        label: 'End',
    },
    {
        key: 'workingHours',
        label: 'WorkingHours',
    },
    {
        key: 'status',
        label: 'Status',
    },
    {
        key: 'reason',
        label: 'Reason',
    },
]

export const summaryColumnHeaders = [
    {
        accessor: 'employeeId',
        Header: 'ID',
    },
    {
        accessor: 'name',
        Header: 'Name',
    },
    {
        accessor: 'days',
        Header: '기준일',
    },
    {
        accessor: 'workingDays',
        Header: '근무일',
    },
    {
        accessor: 'workingHours',
        Header: 'WorkingHours',
    },
    {
        accessor: '미출근',
        Header: '미출근',
    },
    {
        accessor: '정상출근',
        Header: '정상출근',
    },
    {
        accessor: '지각',
        Header: '지각',
    },
    {
        accessor: '휴가',
        Header: '휴가',
    },
    {
        accessor: '반차',
        Header: '반차',
    },
    {
        accessor: '외근',
        Header: '외근',
    },
    {
        accessor: '파견',
        Header: '파견',
    },
    {
        accessor: '재택',
        Header: '재택',
    },
    {
        accessor: '기타',
        Header: '기타',
    }
]

export const summaryCsvHeaders = [
    {
        key: 'employeeId',
        label: 'ID',
    },
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'days',
        label: '기준일',
    },
    {
        key: 'workingDays',
        label: '근무일',
    },
    {
        key: 'workingHours',
        label: 'WorkingHours',
    },
    {
        key: '미출근',
        label: '미출근',
    },
    {
        key: '정상출근',
        label: '정상출근',
    },
    {
        key: '지각',
        label: '지각',
    },
    {
        key: '휴가',
        label: '휴가',
    },
    {
        key: '반차',
        label: '반차',
    },
    {
        key: '외근',
        label: '외근',
    },
    {
        key: '파견',
        label: '파견',
    },
    {
        key: '재택',
        label: '재택',
    },
    {
        key: '기타',
        label: '기타',
    }
]

export const deviceColumnHeaders = [
    {
        accessor: 'ip',
        Header: 'IP',
    },
    {
        accessor: 'mac',
        Header: 'MAC',
    },
    {
        accessor: 'vendor',
        Header: 'Vendor',
    },
    {
        accessor: 'registerDate',
        Header: '등록일',
    },
    {
        accessor: 'endDate',
        Header: '최종 확인일',
    },
    {
        accessor: 'info',
        Header: 'Info',
    },
    {
        accessor: 'owner',
        Header: '소유자',
    },
]

export const deviceCsvHeaders = [
    {
        key: 'ip',
        label: 'IP',
    },
    {
        key: 'mac',
        label: 'MAC',
    },
    {
        key: 'vendor',
        label: 'Vendor',
    },
    {
        key: 'registerDate',
        label: '등록일',
    },
    {
        key: 'endDate',
        label: '최종 확인일',
    },
    {
        key: 'info',
        label: 'Info',
    },
    {
        key: 'owner',
        label: '소유자',
    },
]
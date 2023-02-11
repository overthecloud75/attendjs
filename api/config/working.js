export const WORKING = {
    time: {beginTime: '100000', lunchTime: '123000', lunchFinishTime: '133000', overNight: '040000'},
    inStatus: ['정상출근', '지각', '미출근'],
    outStatus: {
        '휴가': ['연차', '휴가', '월차', '병가', '공가'], 
        '반차': ['반차'], 
        '외근': ['출장', '설명회', '미팅', '평가', '외근', '정기점검'],
        '파견': ['파견'],
        '재택': ['재택'],
        '기타': ['기타']
    }, 
    update: ['상근', '병특'],
    status: {연차: 0, 휴가: 0, 월차: 0, 병가: 0, 공가: 0, 반차: 4, 출장: 8, 설명회: 8, 미팅: 8, 평가: 8,
             외근: 8, 파견: 8, 재택: 8, 정기점검: 8, 출근: 8, 기타: 8},
    offDay: {연차: 1, 휴가: 1, 월차: 1, 병가: 0, 공가: 0, 반차: 0.5, 지각: 0.25, 미출근: 1},
    holidays: ['0301', '0501', '0505', '0606', '0717', '0815', '1003', '1009', '1225'],
    specialHolidays: ['선거', '명절'],
    lunarHolidays: ['0101', '0102', '0408', '0814', '0815', '0816'],
    alternativeVacation: ['0301', '0505', '0815', '1003', '1009']
}
// 통신사 IP 
// https://namu.wiki/w/%ED%86%B5%EC%8B%A0%EC%82%AC%20IP
export const MOBILE_IP_LIST = [ '203.226', '211.234', '223.33', '223.38', '223.39', '223.62', '39.7', '110.70', '118.235', '175.223', '211.246', '106.101', '106.102', '117.111', '211.36']

export const getReverseStatus = () => {
    let reverseStatus = {}
    for (const status of Object.keys(WORKING.outStatus)) {
        for (const reverse of WORKING.outStatus[status]) {
            reverseStatus[reverse] = status
        }
    }
    return reverseStatus 
}
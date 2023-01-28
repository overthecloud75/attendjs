export const getToday = () => {
    let today = new Date()

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const dateString = year + '-' + month  + '-' + day;

    return dateString 
}

export const separateIP = (x_forwarded_for) => {
    const ipList = x_forwarded_for.split(',')
    if (ipList.length > 1) {
        const externalIP = ipList[0].split(':')[0]
        const internalIP = ipList[1]
        return {externalIP, internalIP}
    }
    else {
        const externalIP = ipList[0]
        const internalIP = ipList[0]
        return {externalIP, internalIP}
    }
}

export const sanitizeData = (data, type) => {
    let regex 
    if (data) {
        if (type === 'date') {
            regex = /^\d{4}-\d{2}-\d{2}$/
            if (data.match(regex) === null) {
                return getToday()
            }
        } else if (type === 'email') {
            regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            if (data.match(regex) === null) {
                return false
            }
        }
    }
    return data 
}
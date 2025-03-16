export const getToday = () => {
    let today = new Date()

    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + today.getDate()).slice(-2)
    const dateStr = year + '-' + month  + '-' + day
    return dateStr
}
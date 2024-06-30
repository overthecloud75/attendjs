import { JSDOM } from 'jsdom'

export const getImageId = (content) => {
    const dom = new JSDOM(content)
    const document = dom.window.document

    // img 요소 찾기
    const imgElement = document.querySelector('figure.image img')
  
    // src 속성값 추출
    const imageSrc = imgElement ? imgElement.src : null
    let imageId
    if (imageSrc) {
        const imageSrcSplit = imageSrc.split('/')
        imageId = imageSrcSplit[imageSrcSplit.length - 1]
    } else {
        imageId = ''
    }
    return imageId
}

export const getReSize = (width, height) => {
    const standardWidth = 450
    const standardHeight = 700
    let resizeWidth, resizeHeight
    let widthWide = true
    if (height / width > standardHeight / standardWidth ) {widthWide = false}
    if (widthWide && width > standardWidth) {
        resizeWidth = standardWidth
        resizeHeight = Math.round(height / width * standardWidth)
    } else if (!widthWide && height > standardHeight) {
        resizeWidth = Math.round(width / height * standardHeight)
        resizeHeight = standardHeight
    } else {
        resizeWidth = width
        resizeHeight = height
    }
    return {resizeWidth, resizeHeight} 
}
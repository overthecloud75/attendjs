import ExcelJS from 'exceljs'
import { v4 as uuidv4 } from 'uuid'
import { getYearMonth } from './util.js'
import { ensureDirectoryExists } from './file.js'
import { getReSize } from './image.js'

export const fillPaymentExcelTemplate = async (approval, uploadImage) => {
    const workbook = new ExcelJS.Workbook()
  
    // 템플릿 파일 불러오기
    await workbook.xlsx.readFile('utils/개인경비청구서.xlsx')
  
    // 워크시트 가져오기
    const worksheet = workbook.getWorksheet('sheet')
  
    // 셀 데이터 채우기
    worksheet.getCell('A2').value = '개인경비청구서_' + approval.name
    worksheet.getCell('C3').value = approval.email      // email
    worksheet.getCell('G3').value = approval.name      // email
    worksheet.getCell('C4').value = approval.cardNo     // 카드번호
    worksheet.getCell('G4').value = approval.start.slice(0, 7)    // 기간
    worksheet.getCell('B8').value = approval.reason     // 기간
    worksheet.getCell('D8').value = approval.start      // 적용
    worksheet.getCell('E8').value = approval.etc        // 비용
    worksheet.getCell('E49').value = approval.etc       // 비용
    
    // 이미지 삽입
    const imageId = workbook.addImage({
        filename:  uploadImage.destination + uploadImage.fileName,
        extension: uploadImage.fileName.split('.')[1]
    })
  
    const {resizeWidth, resizeHeight} = getReSize(uploadImage.width, uploadImage.height)

    worksheet.addImage(imageId, {
        tl: { col: 1, row: 8 }, 
        ext: { width: resizeWidth, height: resizeHeight} // size of the image
    })

    // 변경된 내용을 새 파일로 저장
    const { year, month } = getYearMonth()
    ensureDirectoryExists('payments/'+ year + '/' + month + '/')  
    const destination = 'payments/'+ year + '/' + month + '/' + `${uuidv4()}.xlsx`
   
    await workbook.xlsx.writeFile(destination)
    const fileName = '개인경비청구서_' + approval.name + '_' + approval.start + '.xlsx'
    return {destination, fileName}
}

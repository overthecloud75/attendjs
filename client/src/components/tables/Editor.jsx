import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import imageCompression from 'browser-image-compression'
import { postUpload } from '../../utils/UploadUtil.jsx' 

const COMPRESSION_OPTIONS = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
}

const getSiteUrl = () => {
    const { protocol, hostname, port } = window.location;
    const scheme = protocol.replace(':', '')
    const baseUrl = `${scheme}://${hostname}`
    return port ? `${baseUrl}:${port}` : baseUrl
}

const convertToWebP = async (file) => {
    try {
        // 이미지 파일인지 확인
        if (!file.type.startsWith('image/')) {
            throw new Error('이미지 파일만 업로드 가능합니다.')
        }
        // 이미지 압축 및 WebP 변환
        const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)
        // 새로운 File 객체 생성 (WebP 확장자로)
        const convertedFile = new File(
            [compressedFile], 
            `${file.name.split('.')[0]}.webp`,
            { type: 'image/webp' }
        )
        return convertedFile
    } catch (error) {
        console.error('Image conversion error:', error)
        throw error
    }
}

const Editor = ({writeMode, value, setValue, isReadOnly}) => {
    const handleEditReady = (editor) => {
        if (writeMode) {setValue({...value, id: editor.id})}
        editor.editing.view.change((writer) => {
            writer.setStyle('min-height', '400px', editor.editing.view.document.getRoot())
        })
    }
   
    const handleEditChange = (e, editor) => {
        setValue({...value, content: editor.getData()})
    }
     
    const imageUploadAdapter = (loader) => {
        const imgLink = getSiteUrl() + '/api/upload/image'
        return {
            upload: async () => {
                try {
                    const originalFile = await loader.file
                    const webpFile = await convertToWebP(originalFile)
                    const result = await postUpload(webpFile)
                    if (!result.err) {
                        return {
                            default: `${imgLink}/${result.resData.filename}`
                        }
                    } else {
                        throw result.err
                    }
                } catch (error) {
                    console.error('Error uploading file:', error)
                }
            }
        }
    }

    function uploadImagePlugin(editor) { 
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return imageUploadAdapter(loader)
        }
    }
  
    return ( 
        <CKEditor
            editor={ ClassicEditor }
            config={{
                licenseKey: 'GPL', 
                extraPlugins: [uploadImagePlugin],
            }}
            data={ value.content }
            onReady={ editor => handleEditReady(editor)}
            onChange={ (e, editor) => handleEditChange(e, editor)}
            disabled={isReadOnly}
        />
    )
}

export default Editor
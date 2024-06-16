import { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { postUpload } from '../../utils/UploadUtil.jsx'
import { siteUrl } from '../../configs/apiKey.js' 

const Editor = ({writeMode, value, setValue}) => {
    
    const [flag, setFlag] = useState(false)
    // eslint-disable-next-line
    const [image, setImage] = useState('')

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
        const imgLink = siteUrl + '/api/upload/image'
        return {
            upload: async () => {
                try {
                    const file = await loader.file;
                    const result = await postUpload(file)
                    if (!result.err) {
                        if (!flag) {
                            setFlag(true)
                            setImage(result.resData.filename)
                        }
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
                extraPlugins: [uploadImagePlugin]
            }}
            data={ value.content }
            onReady={ editor => handleEditReady(editor)}
            onChange={ (e, editor) => handleEditChange(e, editor)}
        />
    )
}

export default Editor
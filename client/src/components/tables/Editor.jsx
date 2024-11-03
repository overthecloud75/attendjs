import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { postUpload } from '../../utils/UploadUtil.jsx' 

const SiteUrl = () => {
    const { protocol, hostname, port } = window.location;
    const scheme = protocol.replace(':', '')
    let siteUrl = scheme + '://' + hostname 
    if (port) {
        siteUrl = siteUrl + ':' + port
    }
    return siteUrl
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
        const imgLink = SiteUrl() + '/api/upload/image'
        return {
            upload: async () => {
                try {
                    const file = await loader.file
                    const result = await postUpload(file)
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
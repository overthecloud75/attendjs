import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Approval from '../Approval.jsx'
import Payment from './Payment.jsx'
import CsvDownload from './CsvDownload'
import { AdminEditablePages, UserEditablePages } from '../../configs/pages'
import { getUser } from '../../storage/userSlice.js'

// https://github.com/CodeFocusChannel/Table-Styling-React/blob/master/src/components/styled-components-table/styles.js

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 5px 0 5px;
    font-size: 14px;
`

const getEditablePages = (user) => {
    let editablePages = AdminEditablePages
    if (!user.isAdmin) {
        editablePages = UserEditablePages
    }
    return editablePages
}

// useTable에다가 작성한 columns와 data를 전달한 후 아래 4개의 props를 받아온다
// initialState https://github.com/TanStack/table/discussions/2029

const TableButtons = ({url, data, csvHeaders, fileName, writeMode, setWriteMode, setOpenEditWrite, setSelectedRowData, setOpenUpdate}) => {
    const user = getUser()
    const editablePages = getEditablePages(user)

    const navigate = useNavigate()
    const [openApproval, setOpenApproval] = useState(false)
    const [openPayment, setOpenPayment] = useState(false)

    const handleWriteClick = () => {
        setWriteMode(true)
        if (['board', 'report'].includes(url)) {
            setOpenEditWrite(true)
        } else if (AdminEditablePages.includes(url)) {
            setSelectedRowData({})
            setOpenUpdate(true)
        }
    }
    
    const handleAttendClick = () => {
        setOpenApproval(true)
    }

    const handlePaymentClick = () => {
        setOpenPayment(true)
    }
    
    return (
        <Container>
            {openApproval&&(
                <Approval
                    navigate={navigate}
                    open={openApproval}
                    setOpen={setOpenApproval}
                />
            )}
            {openPayment&&(
                <Payment
                    writeMode={writeMode}
                    open={openPayment}
                    setOpen={setOpenPayment}
                />
            )}
            <div className='buttons'>
                {(url==='approval')&&(
                    <button 
                        className='defaultButton'
                        onClick={handleAttendClick}
                    >근태 결재
                    </button>
                )}
                {(url==='approval')&&(
                    <button 
                        className='defaultButton'
                        onClick={handlePaymentClick}
                    >지출 결재
                    </button>
                )}
                {editablePages.includes(url)&&(
                    <button 
                        className='defaultButton'
                        onClick={handleWriteClick}
                    >New 
                    </button>
                )}
                <CsvDownload
                    data={data}
                    headers={csvHeaders}
                    fileName={fileName}
                />
            </div>
        </Container>
    )
}

export default TableButtons
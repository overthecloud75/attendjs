import { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import LeaveHistoryModal from '../components/modals/LeaveHistoryModal'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/summary'

const Summary = () => {
    const { isMobile } = useResponsive()

    const [openModal, setOpenModal] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const handleIdClick = (employee) => {
        setSelectedEmployee(employee)
        setOpenModal(true)
    }

    return (
        <>
            <CustomTableWithSearch
                searchKeyword='name'
                page='summary'
                url='/api/summary/leftleavelist'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                onIdClick={handleIdClick}
            />
            <LeaveHistoryModal
                open={openModal}
                setOpen={setOpenModal}
                employee={selectedEmployee}
            />
        </>
    )
}

export default Summary
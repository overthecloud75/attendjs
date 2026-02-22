import { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import MainLayout from '../components/layout/MainLayout'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import LeaveHistoryModal from '../components/modals/LeaveHistoryModal'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/summary'

const Summary = ({ menu, setMenu }) => {
    const { isMobile } = useResponsive()

    const [openModal, setOpenModal] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const handleIdClick = (employee) => {
        setSelectedEmployee(employee)
        setOpenModal(true)
    }

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <CustomTableWithSearch
                menu={menu}
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
        </MainLayout>
    )
}

export default Summary
import { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import LeaveHistoryModal from '../components/modals/LeaveHistoryModal'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/summary'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'

const Summary = ({ menu, setMenu }) => {

    useRedirectIfNotAuthenticated()
    const { isMobile } = useResponsive()

    // [New] 모달 상태 관리
    const [openModal, setOpenModal] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    // [New] No 클릭 핸들러
    const handleIdClick = (employee) => {
        setSelectedEmployee(employee)
        setOpenModal(true)
    }

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu} />}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu} />
                <CustomTableWithSearch
                    menu={menu}
                    searchKeyword='name'
                    page='summary'
                    url='/api/summary/leftleavelist'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                    onIdClick={handleIdClick}
                />
            </div>
            {/* [New] 연차 상세 이력 모달 */}
            <LeaveHistoryModal
                open={openModal}
                setOpen={setOpenModal}
                employee={selectedEmployee}
            />
        </div>
    )
}

export default Summary
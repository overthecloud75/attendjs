import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import TableWithSearch from '../components/tables/TableWithSearch'
import Footer from '../components/Footer'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/approval'

const ApprovalHistory = ({menu, setMenu}) => {
    return (     
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <TableWithSearch 
                    searchKeyword='name'
                    page='approval'
                    url='/api/approval/search'
                    columnHeaders={window.innerWidth>600?columnHeaders:mobileColumnHeaders}
                    csvHeaders={csvHeaders}
                />
                {menu && <Footer/>}
            </div>
        </div>  
    )
}

export default ApprovalHistory
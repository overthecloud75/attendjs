import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/tables/TableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/employee'
import Footer from '../components/Footer'

const Employee = ({menu, setMenu}) => {
    return (
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/>    
                <TableWithSearch 
                    searchKeyword='name'
                    page ='employee'
                    url='/api/employee/search'
                    columnHeaders={window.innerWidth>600?columnHeaders:mobileColumnHeaders}
                    csvHeaders={csvHeaders}
                />
                {menu && <Footer/>}
            </div>
        </div>
    )
}

export default Employee
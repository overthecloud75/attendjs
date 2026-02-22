import { useResponsive } from '../hooks/useResponsive'
import MainLayout from '../components/layout/MainLayout'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/board'

const Board = ({ menu, setMenu }) => {
    const { isMobile } = useResponsive()

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <CustomTableWithSearch
                menu={menu}
                searchKeyword='name'
                page='board'
                url='/api/board/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
            />
        </MainLayout>
    )
}

export default Board
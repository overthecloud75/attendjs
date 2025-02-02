import { useState, useEffect } from 'react'
import { Widget, addResponseMessage } from 'react-chat-widget-react-18'
import 'react-chat-widget-react-18/lib/styles.css'
import { chat } from '../utils/ChatUtil'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import TableWithSearch from '../components/tables/TableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/attend'
import Footer from '../components/Footer'

const Attend = ({menu, setMenu}) => {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        addResponseMessage('Welcome to SmartWork chat!')
    }, [])

    const handleNewUserMessage = async (newMessage) => {
        const {resData, err} = await chat({messages, newMessage})
        if (!err) {
            addResponseMessage(resData)
            setMessages([...messages, {role: 'user', content: newMessage}, {role: 'assistant', content: resData}])
        }
    }

    return (     
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <TableWithSearch 
                    searchKeyword='name'
                    page='attend'
                    url='/api/attend/search'
                    columnHeaders={window.innerWidth>600?columnHeaders:mobileColumnHeaders}
                    csvHeaders={csvHeaders}
                />
                {menu && <Footer/>}
            </div>
            <Widget
                title='SmartWork Chat'
                subtitle=''
                handleNewUserMessage={handleNewUserMessage}
                showTimeStamp={false}
            />
        </div>  
    )
}

export default Attend
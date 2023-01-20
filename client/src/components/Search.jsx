import { useState } from 'react'
import styled from 'styled-components'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'
import PersonIcon from '@mui/icons-material/Person'
import DateRangeIcon from '@mui/icons-material/DateRange'
import { DateRange } from 'react-date-range'

const Wrapper = styled.div`
    width: 80%;
    display: flex;
    margin-left: 30px;
    top: 0px;
    position: absolute;
    @media screen and (max-width: 500px) {
        display: none;
    }
`

const Items = styled.div`
    height: 25px;
    background-color: white;
    border: 3px solid #febb02;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px 0px;
    border-radius: 5px;
    width: 70%;
    max-width: 1024px;
    position: relative;
`
const Item = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const Icon = styled.div`
    color: lightgray
`

const Input = styled.input`
    border: none;
    outline: none;
`
const Text = styled.span`
    color: lightgray;
    cursor: pointer;
`
const Button = styled.button`
    background-color: #0071c2;
    color: white;
    font-weight: 500;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
`
const Dates = styled.div`
    position: absolute;
    top: 50px;
    z-index: 9999;
`

const Search = ({page, searchKeyword, name, setName, date, setDate, clickCount, setClickCount, setFileName}) => {

    // dateRange open 
    const [openDate, setOpenDate] = useState(false)

    const handleSearch = (event) => {
        event.preventDefault()
        setOpenDate(false)
        setClickCount(clickCount+1)
        setFileName(page + '_' + format(date[0].startDate, 'yyyy-MM-dd') + '_'+ format(date[0].endDate, 'yyyy-MM-dd') + '_' + name)
    }
    
    return (     
        <Wrapper>
            <Items>
                <Item>
                    <Icon><PersonIcon/></Icon>
                    <Input 
                        placeholder={ searchKeyword } 
                        onChange={(event) => setName(event.target.value)}
                    />
                </Item>
                <Item>
                    <Icon onClick={() => setOpenDate(!openDate)} ><DateRangeIcon/></Icon>
                    <Text>
                        {`${format(date[0].startDate, 'yyyy-MM-dd')} to 
                            ${format(date[0].endDate, 'yyyy-MM-dd')}`
                        }
                    </Text>
                    {openDate && 
                        <Dates>
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDate([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={date}
                                dateDisplayFormat='yyyy-MM-dd'
                            />
                        </Dates>
                    }
                </Item>
                <Item>
                    <Button onClick={handleSearch}>Search</Button>
                </Item>
            </Items>
        </Wrapper>
    )
}

export default Search
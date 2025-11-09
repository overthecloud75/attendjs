import { useState } from 'react'
import styled from 'styled-components'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'
import PersonIcon from '@mui/icons-material/Person'
import DateRangeIcon from '@mui/icons-material/DateRange'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { DateRange } from 'react-date-range'

const Wrapper = styled.div`
    position: absolute;
    align-items: center;
    height: 60px;
    width: 80%;
    display: flex;
    z-index: 1000;
    margin-left: 60px;
    @media screen and (max-width: 1450px) {
        display: none;
    }
`

const SearchContainer = styled.div`
    width: 100%;
    max-width: 900px;
    padding: 5px;
    transition: all 0.3s ease;
    
    &:focus-within {
        border-color: #667eea;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }
    
    @media screen and (max-width: 768px) {
        padding: 5px;
        border-radius: 12px;
    }
`

const SearchForm = styled.form`
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    
    @media screen and (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }
`

const SearchField = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 200px;
    padding: 10px 18px;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:focus-within {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background: #fafbff;
    }
    
    @media screen and (max-width: 768px) {
        min-width: auto;
        padding: 8px 16px;
    }
`

const DateField = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 280px;
    padding: 10px 18px;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
        border-color: #667eea;
        background: #fafbff;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    @media screen and (max-width: 768px) {
        min-width: auto;
        padding: 8px 16px;
    }
`

const Icon = styled.div`
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
    
    ${SearchField}:focus-within &,
    ${DateField}:hover & {
        color: #667eea;
        transform: scale(1.1);
    }
`

const Input = styled.input`
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #1e293b;
    flex: 1;
    font-weight: 500;
    
    &::placeholder {
        color: #94a3b8;
        font-weight: 400;
    }
    
    @media screen and (max-width: 768px) {
        font-size: 13px;
    }
`

const DateText = styled.span`
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    cursor: pointer;
    transition: all 0.3s ease;
    
    ${DateField}:hover & {
        color: #667eea;
    }
    
    @media screen and (max-width: 768px) {
        font-size: 13px;
    }
`

const DatePickerContainer = styled.div`
    position: absolute;
    z-index: 9999;
    top: 100%;
    margin-top: 8px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid #e1e5e9;
    overflow: hidden;
    animation: slideDown 0.3s ease;
`

const Search = ({page, searchKeyword, name, setName, date, setDate, clickCount, setClickCount, setFileName}) => {
    const [openDate, setOpenDate] = useState(false)

    const handleSearch = (event) => {
        event.preventDefault()
        setOpenDate(false)
        setClickCount(clickCount+1)
        setFileName(`${page}_${format(date[0].startDate, 'yyyy-MM-dd')}_${format(date[0].endDate, 'yyyy-MM-dd')}_${name}`)
    }

    return (     
        <Wrapper>
            <SearchContainer>
                <SearchForm onSubmit={handleSearch}>
                    <SearchField>
                        <Icon><PersonIcon/></Icon>
                        <Input 
                            name={searchKeyword}
                            placeholder={`${searchKeyword} 검색...`}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete='off'
                        />
                    </SearchField>
                    
                    <DateField onClick={() => setOpenDate(!openDate)}>
                        <Icon><DateRangeIcon/></Icon>
                        <DateText>
                            {`${format(date[0].startDate, 'yyyy-MM-dd')} ~ ${format(date[0].endDate, 'yyyy-MM-dd')}`}
                        </DateText>
                        {openDate && 
                            <DatePickerContainer onClick={(e) => e.stopPropagation()}>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={item => setDate([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={date}
                                    dateDisplayFormat='yyyy-MM-dd'
                                />
                            </DatePickerContainer>
                        }
                    </DateField>   
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            fontSize: 14,
                            px: 2,
                            py: 1,
                            textTransform: 'none', 
                        }}
                    >
                        검색
                    </Button>
                </SearchForm>
            </SearchContainer>
        </Wrapper>
    )
}

export default Search
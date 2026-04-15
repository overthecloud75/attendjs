import { useState } from 'react'
import MeetingRoomContainer from '../components/meeting/MeetingRoomContainer'
import MeetingRoomButtons from '../components/meeting/MeetingRoomButtons'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import { Calendar } from 'lucide-react'

const MeetingRoom = () => {
    const { t } = useTranslation()
    const [eventsData, setEventsData] = useState([])

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={Calendar}
                title={t('sidebar-meetings', '회의실 예약')}
                subtitle={t('meetings-subtitle', '실시간 회의실 예약 현황을 확인하고 일정을 등록합니다.')}
                extra={
                    <MeetingRoomButtons 
                        eventsData={eventsData} 
                        setEventsData={setEventsData} 
                    />
                }
                breadcrumbs={[
                    { label: t('sidebar-common', '공통'), path: '#' },
                    { label: t('sidebar-meetings', '회의실 예약') }
                ]}
            />
            <MeetingRoomContainer 
                eventsData={eventsData} 
                setEventsData={setEventsData} 
            />
        </Box>
    )
}

export default MeetingRoom
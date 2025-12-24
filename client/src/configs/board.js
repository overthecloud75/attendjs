export const BOARD_TYPES = [
    { value: 'NOTICE', label: '공지사항' },
    { value: 'FREE', label: '자유게시판' },
    { value: 'QNA', label: 'Q&A' },
    { value: 'ARCHIVE', label: '자료실' }
]

export const columnHeaders = [
    {
        accessorKey: 'boardType',
        header: '유형',
        size: 80,
    },
    {
        accessorKey: 'title',
        header: '제목',
        size: 300,
    },
    {
        accessorKey: 'authorName',
        header: '작성자',
        size: 100,
    },
    {
        accessorKey: 'viewCount',
        header: '조회수',
        size: 70,
    },
    {
        accessorKey: 'createdAt',
        header: '작성일',
        size: 100,
        // format logic can be handled in component
    }
]

export const mobileColumnHeaders = [
    {
        accessorKey: 'title',
        header: '제목',
    },
    {
        accessorKey: 'authorName',
        header: '작성자',
    }
]

export const csvHeaders = [
    { key: 'boardType', label: 'Type' },
    { key: 'title', label: 'Title' },
    { key: 'authorName', label: 'Author' },
    { key: 'viewCount', label: 'Views' },
    { key: 'createdAt', label: 'Date' }
]
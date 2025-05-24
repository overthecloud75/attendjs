import styled from 'styled-components'

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
`

const Feature = () => {
    return (
        <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: -1,
            opacity: 0.2
        }}>
            <Image src='/employees.webp'/>
        </div>
    )
}

export default Feature
import useFetch from '../hooks/useFetch'

const CheckConfirm = ({url}) => {

    // eslint-disable-next-line
    const {data, setData, loading, error} = useFetch(
        '', url, {}, 0
    )

    return (
        <dir>
            {!error?data.email + ' is activated':'Something went wrong'}
        </dir>
    )
}

export default CheckConfirm
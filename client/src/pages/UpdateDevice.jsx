import queryString from 'query-string'
import { useLocation, useParams } from 'react-router'

const UpdateDevice = () => {

    const params = useParams()
    const location = useLocation()

    const query = queryString.parse(location.search);

    return (
        <dir>
            <dir>UpdateDevice</dir>
            <dir>{params._id}</dir>
            <dir>{query.mac}</dir>
        </dir>
    )
}

export default UpdateDevice
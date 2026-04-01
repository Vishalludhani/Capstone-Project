import { useRouteError } from 'react-router'
import { errorClass } from '../styles/common'

function ErrorBoundary() {

    const { data, status, statusText } = useRouteError()

    return (
        <div>
            <p className={`${errorClass} text-center mt-50 font-bold`}>{data}</p><br />
            <p className={`${errorClass} text-center`}>{status} - {statusText}</p>
        </div>
    )
}

export default ErrorBoundary
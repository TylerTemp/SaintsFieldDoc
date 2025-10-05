//
// import { toast } from 'react-toastify';
import { toast } from 'mui-sonner';


// interface Params {
//     message: string | JSX.Element,
//     severity: 'success' | 'error'
// }

export default (title: string | undefined, message: string, severity?: 'success' | 'info' | 'error') => {
    const config = title?  {description: message, duration: 3000, closeButton: true}: undefined;
    if(severity === undefined) {
        toast(title? title: message, config);
    }
    else
    {
        toast[severity](title? title: message, config);
    }
}

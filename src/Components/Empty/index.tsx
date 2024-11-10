import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';

// import '@fontsource/roboto/300.css';
import Typography from '@mui/material/Typography';
import Style from './index.css';
import { PropsWithChildren } from 'react';

export default ({children}: PropsWithChildren) => {
    return <div className={Style.container}>
        <InboxTwoToneIcon color="warning" fontSize="large" />
        <Typography variant="h6" component="h2">
            {children}
        </Typography>
    </div>
}

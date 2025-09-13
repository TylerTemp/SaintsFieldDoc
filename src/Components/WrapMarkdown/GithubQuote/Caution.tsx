import { PropsWithChildren } from 'react';
import Basic from './Basic';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import useTheme from '@mui/material/styles/useTheme';

export default ({children}: PropsWithChildren) => {
    const theme = useTheme();
    return <Basic
        color={theme.palette.error.main}
        icon={<ErrorTwoToneIcon sx={{color: theme.palette.error.main}} />}
        title="Caution"
    >
        {children}
    </Basic>;
};


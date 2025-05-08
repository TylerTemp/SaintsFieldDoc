import { PropsWithChildren } from 'react';
import Basic from './Basic';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import useTheme from '@mui/material/styles/useTheme';

export default ({children}: PropsWithChildren) => {
    const theme = useTheme();
    return <Basic
        color={theme.palette.primary.main}
        icon={<InfoTwoToneIcon color="primary" />}
        title="Note"
    >
        {children}
    </Basic>;
};


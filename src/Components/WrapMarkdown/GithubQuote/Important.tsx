import { PropsWithChildren } from 'react';
import Basic from './Basic';
import AnnouncementTwoToneIcon from '@mui/icons-material/AnnouncementTwoTone';
import useTheme from '@mui/material/styles/useTheme';

export default ({children}: PropsWithChildren) => {
    const theme = useTheme();
    return <Basic
        color={theme.palette.importantQuote.main}
        icon={<AnnouncementTwoToneIcon sx={{color: theme.palette.importantQuote.main}} />}
        title="Important"
    >
        {children}
    </Basic>;
};


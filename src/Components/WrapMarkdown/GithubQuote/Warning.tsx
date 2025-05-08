import { PropsWithChildren } from 'react';
import Basic from './Basic';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import useTheme from '@mui/material/styles/useTheme';

export default ({children}: PropsWithChildren) => {
    const theme = useTheme();
    return <Basic
        color={theme.palette.warning.main}
        icon={<WarningTwoToneIcon color="warning" />}
        title="Warning"
    >
        {children}
    </Basic>;
};


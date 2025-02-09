import { PropsWithChildren } from 'react';
import Basic from './Basic';
import LightbulbTwoToneIcon from '@mui/icons-material/LightbulbTwoTone';
import useTheme from '@mui/material/styles/useTheme';

export default ({children}: PropsWithChildren) => {
    const theme = useTheme();
    return <Basic
        color={theme.palette.success.main}
        icon={<LightbulbTwoToneIcon color="success" />}
        title="Tip"
    >
        {children}
    </Basic>;
};


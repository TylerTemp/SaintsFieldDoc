import { JSX, useState, useEffect } from 'react';
import IconButton from "@mui/material/IconButton";
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Tooltip from "@mui/material/Tooltip";
import { type SxProps } from '@mui/material';
import enquereToast from '~/Utils/enquereToast';

interface State {
    title: string,
    color: "secondary" | "success" | "error",
    icon: JSX.Element,
}

const DefaultState: State = {
    title: "Copy",
    color: "secondary",
    icon: <ContentCopyTwoToneIcon />
};

const OkState: State = {
    title: "Copied!",
    color: "success",
    icon: <CheckTwoToneIcon />
};

const ErrorState: State = {
    title: "Error!",
    color: "error",
    icon: <CloseTwoToneIcon />
};

const WriteToClipboard = async (text: string) => {
    if(navigator.clipboard)
    {
        return navigator.clipboard.writeText(text);
    }
    return Promise.reject("The Clipboard API is not available.");
}

export default ({content, sx}: {content: string, sx?: SxProps}) => {
    // console.log(`navigator.clipboard=${navigator.clipboard}`)
    if(!navigator.clipboard) {
        return <></>;
    }

    const [state, setState] = useState<State>(DefaultState);
    const [timeout, setTimeoutId] = useState<NodeJS.Timeout>(setTimeout(() => {}, 0));

    const onClick = () => {
        WriteToClipboard(content)
            .then(() => {
                setState(OkState);
            })
            .catch((reason) => {
                setState(ErrorState);
                console.error(reason);
                enquereToast("Copy Failed", `${reason}`, 'error');
            })
            .finally(() => {
                clearTimeout(timeout);
                setTimeoutId(
                    setTimeout(() => {
                        setState(DefaultState);
                    }, 1500)
                );
            });
    }

    useEffect(() => {
        return () => {
            clearTimeout(timeout);
        }
    }, []);


    return <Tooltip title={state.title} placement="top" arrow onClick={onClick}>
        <IconButton size="small" color={state.color} sx={sx}>
            {state.icon}
        </IconButton>
    </Tooltip>;
};

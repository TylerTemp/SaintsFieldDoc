import Box from "@mui/material/Box/Box";
import Container from "@mui/material/Container/Container";
import FormControl from "@mui/material/FormControl/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import ReadMeData from "~/Data/ReadMe.json";
import type { TitleAndContent } from "~/Data/Types";
import { PrefixUri } from "~/Utils/Util";

interface Searchable {
    Title: string
    URI: string
    Search: string
}


const ExtractSearchable = ({Title, TitleId, Content, SubContents}: TitleAndContent, prefix: string | null): Searchable[] => {
    const searches: Searchable[] = [];

    let thisTitleId = PrefixUri(prefix, TitleId);
    if(!thisTitleId.startsWith("/")) {
        thisTitleId = `/${thisTitleId}`;
    }

    if(Content !== "") {
        searches.push({
            Title,
            Search: `${Title} ${Content}`,
            URI: thisTitleId,
        });
    }

    for (let index = 0; index < SubContents.length; index++) {
        const eachSubContent = SubContents[index];
        searches.push(...ExtractSearchable(eachSubContent, thisTitleId));
    }

    return searches;
}


export default () => {

    const [search, setSearch] = useState<string>("");

    const readMe: TitleAndContent[] = ReadMeData;

    const searchables: Searchable[] = useMemo(
        () => [...readMe.map(each => ExtractSearchable(each, null))].reduce((a, v) => [...a, ...v], []),
        []);

    return (<Container maxWidth="xl">
        <Helmet>
            <title>Search | SaintsField</title>
        </Helmet>

        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
            <OutlinedInput
                id="outlined-adornment-search"
                type='text'
                value={search}
                onChange={evt => setSearch(evt.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setSearch("")}
                            edge="end"
                        >
                            {search === "" ? <SearchTwoToneIcon /> : <HighlightOffTwoToneIcon />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>

        <Box>
        </Box>
    </Container>);
}
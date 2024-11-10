import Box from "@mui/material/Box/Box";
import Container from "@mui/material/Container/Container";
import FormControl from "@mui/material/FormControl/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import ReadMeData from "~/Data/ReadMe.json";
import type { TitleAndContent } from "~/Data/Types";
import { PrefixUri } from "~/Utils/Util";
import MiniSearch, { type SearchResult } from 'minisearch'
import Divider from "@mui/material/Divider/Divider";
import {default as MuiLink} from "@mui/material/Link/Link";
import { Link } from "react-router-dom";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import WrapMarkdown from "~/Components/WrapMarkdown";
import useDebounce from "~/Utils/useDebounce";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import Empty from "~/Components/Empty";


interface Searchable {
    title: string
    content: string
    id: string
    // Search: string
}


// interface SearchResult {
//     Source: Searchable
//     // Matrix: Matrix
// }


const ExtractSearchable = ({Title, TitleId, Content, SubContents}: TitleAndContent, prefix: string | null): Searchable[] => {
    const searches: Searchable[] = [];

    let thisTitleId = PrefixUri(prefix, TitleId);
    if(!thisTitleId.startsWith("/")) {
        thisTitleId = `/${thisTitleId}`;
    }

    if(Content !== "") {
        searches.push({
            title: Title,
            content: Content,
            id: thisTitleId,
        });
    }

    for (let index = 0; index < SubContents.length; index++) {
        const eachSubContent = SubContents[index];
        searches.push(...ExtractSearchable(eachSubContent, thisTitleId));
    }

    return searches;
}


type IdToSearchable = {
    [term: string]: Searchable;
};

interface WrapSearchResult {
    Source: Searchable,
    Result: SearchResult,
}


export default () => {

    const {startDebounce, debouncing} = useDebounce(500);

    const [searchInput, setSearchInput] = useState<string>("");

    const readMe: TitleAndContent[] = ReadMeData;

    const searchables: Searchable[] = useMemo(
        () => [...readMe.map(each => ExtractSearchable(each, null))].reduce((a, v) => [...a, ...v], []),
        []);

    // const idToSearchable: IdToSearchable = useMemo(() => {
    //     const idToSearchable: IdToSearchable = {};
    //     for (let index = 0; index < searchables.length; index++) {
    //         const seachTarget = searchables[index];
    //         idToSearchable[seachTarget.id] = seachTarget;
    //     }
    //     return idToSearchable;
    // }, [searchables]);

    const miniSearch: MiniSearch = useMemo(() => {
        const miniSearch = new MiniSearch({
            fields: ['title', 'content'], // fields to index for full-text search
            storeFields: ['title', 'content'] // fields to return with search results
          });
        miniSearch.addAll(searchables);
        return miniSearch;
    }, []);

    // const searchResults: SearchResult[] = useMemo(() => GetSearchResults(searchInput, searchables), [searchInput]);

    // console.log(searchResults.length);
    // const results = miniSearch.search('Rich');
    // console.log(results);

    // const searchResults: SearchResult[] = useMemo(() => miniSearch.search(searchInput), [searchInput]);

    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        startDebounce(() => setSearchResults(miniSearch.search(searchInput)));
    }, [searchInput])
    // console.log(searchResults);

    return (<Container maxWidth="xl">
        <Helmet>
            <title>Search | SaintsField</title>
        </Helmet>

        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
            <OutlinedInput
                id="outlined-adornment-search"
                type='text'
                value={searchInput}
                onChange={evt => setSearchInput(evt.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setSearchInput("")}
                            edge="end"
                        >
                            {searchInput === "" ? <SearchTwoToneIcon /> : <HighlightOffTwoToneIcon />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>

        {debouncing && <LinearProgress />}

        {searchResults.length === 0 && !debouncing && <Box sx={{minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Empty>
            {searchInput === ""? "Input something to search": "Nothing found"}
            </Empty>
        </Box>}

        {searchResults.length > 0 && <Divider />}

        {searchResults.map(({id, title, content}) => <Accordion key={id} slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Markdown remarkPlugins={[remarkGfm]} disallowedElements={['p']} unwrapDisallowed>{title}</Markdown>
            </AccordionSummary>
            <AccordionDetails>

                <AccordionActions>
                    <Button component={Link} to={id}>
                        Open
                    </Button>
                </AccordionActions>

                <WrapMarkdown>{content}</WrapMarkdown>
            </AccordionDetails>
        </Accordion>)}

    </Container>);
}
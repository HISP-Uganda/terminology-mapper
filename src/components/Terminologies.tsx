import { HStack, Input, Text, Button } from "@chakra-ui/react";
import { useMatch, useNavigate } from "@tanstack/react-location";
import { ChangeEvent, useState } from "react";
import { LocationGenerics } from "../App";
import { SearchResults } from "./SearchResults";
import pluralize from "pluralize";

const Terminologies = () => {
    const navigate = useNavigate();
    const {
        params: { index },
    } = useMatch<LocationGenerics>();
    const [query, setQuery] = useState<string>("");
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };
    return (
        <>
            <HStack>
                <Input
                    placeholder={`Search ${index}`}
                    onChange={onChange}
                    value={query}
                />
                <Text> {index}</Text>
                <Button onClick={() => navigate({ to: `/${index}/form` })}>
                    Add {pluralize.singular(index)}
                </Button>
            </HStack>
            {query !== "" && <SearchResults q={query} />}
        </>
    );
};

export default Terminologies;

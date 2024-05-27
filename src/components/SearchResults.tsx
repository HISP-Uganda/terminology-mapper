import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Link, useMatch } from "@tanstack/react-location";
import pluralize from "pluralize";
import { FC, useState } from "react";
import { useQueryClient } from "react-query";
import { LocationGenerics } from "../App";
import { deleteDoc, useSearch } from "../queries";

interface SearchProps {
    q: string;
}
export const SearchResults: FC<SearchProps> = ({ q }) => {
    const [deleting, setDeleting] = useState<boolean>(false);
    const {
        params: { index },
    } = useMatch<LocationGenerics>();
    const { isError, isSuccess, data, error, isLoading, isFetching } =
        useSearch(index || "", q);
    const queryClient = useQueryClient();

    const deleteRecord = async (id: string) => {
        setDeleting(true);
        await deleteDoc({ id, index });
        await queryClient.invalidateQueries(["search", index, q]);
        setDeleting(false);
    };
    return (
        <Box mt="20px">
            {(isLoading || isFetching) && <Box>Loading</Box>}
            {isSuccess && (
                <>
                    {data.length > 0 ? (
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Identifier</Th>
                                    <Th>{pluralize.singular(index || "")}</Th>
                                    <Th>Details</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((dt: any) => (
                                    <Tr key={dt.id}>
                                        <Td>{dt.id}</Td>
                                        <Td>{dt.name}</Td>
                                        <Td>
                                            <Link<LocationGenerics>
                                                to={`/${index}/${dt.id}`}
                                            >
                                                <a>Details</a>
                                            </Link>
                                        </Td>
                                        <Td>
                                            <Button
                                                onClick={() =>
                                                    deleteRecord(dt.id)
                                                }
                                                isLoading={deleting}
                                            >
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : (
                        <Box>No Records</Box>
                    )}
                </>
            )}
            {isError && <Box>{error.message}</Box>}
        </Box>
    );
};

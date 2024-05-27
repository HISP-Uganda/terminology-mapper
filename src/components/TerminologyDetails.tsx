import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    SimpleGrid,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { Field, Form, Formik } from "formik";
import { FaPlus } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import { LocationGenerics } from "../App";
import { indexConcept, useConcept } from "../queries";

const ExtensionSchema = Yup.object().shape({
    system: Yup.string().required("Required"),
    ode: Yup.string(),
});

const MappingSchema = Yup.object().shape({
    system: Yup.string().required("Required"),
    code: Yup.string().required("Required"),
});

const TerminologyDetails = () => {
    const {
        params: { id, index },
    } = useMatch<LocationGenerics>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const queryClient = useQueryClient();

    const { isLoading, isSuccess, isError, data, error } = useConcept(
        index || "",
        id
    );

    const { mutateAsync } = useMutation(indexConcept, {
        onSuccess: (data: any) => {
            queryClient.setQueryData(["concept", index, id], data.data);
        },
    });

    const deleteMapping = async (mapping: any) => {
        const mappings = data.mappings.filter((map: any) => {
            return map.system !== mapping.system && map.code !== mapping.code;
        });
        await mutateAsync({ ...data, mappings, index: index, idField: "id" });
    };

    const changeAttributeType = async (data: any, value: string) => {
        mutateAsync({ ...data, type: value, index: index, idField: "id" });
    };

    const makeIdentifier = async (data: any, value: boolean) => {
        mutateAsync({
            ...data,
            identifier: value,
            index: index,
            idField: "id",
        });
    };

    return (
        <>
            {isLoading && <Box>Loading</Box>}
            {isSuccess && !!data && (
                <Box>
                    <Text>Terminology Details</Text>
                    <SimpleGrid columns={2} mt="20px">
                        <HStack>
                            <Text>ID</Text>
                            <Text>{data.id}</Text>
                        </HStack>
                        <HStack>
                            <Text>Name</Text>
                            <Text>{data.name}</Text>
                        </HStack>
                        <HStack>
                            <Text>Short Name</Text>
                            <Text>{data.shortName}</Text>
                        </HStack>
                        <HStack>
                            <Text>Description</Text>
                            <Text>{data.description}</Text>
                        </HStack>
                    </SimpleGrid>

                    {index === "entities" && (
                        <Box mt="20px">
                            <RadioGroup
                                value={data.type}
                                onChange={(e: any) =>
                                    changeAttributeType(data, e)
                                }
                            >
                                <Stack direction="row">
                                    <Radio value="Person">Person</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>
                    )}

                    {index === "attributes" && (
                        <Box mt="20px">
                            <Checkbox
                                isChecked={!!data.identifier}
                                onChange={(e: any) =>
                                    makeIdentifier(data, e.target.checked)
                                }
                            >
                                Identifier
                            </Checkbox>
                            <RadioGroup
                                value={data.type}
                                onChange={(e: any) =>
                                    changeAttributeType(data, e)
                                }
                            >
                                <Stack direction="row">
                                    <Radio value="gender">Gender</Radio>
                                    <Radio value="address">Address</Radio>
                                    <Radio value="given">Given Name</Radio>
                                    <Radio value="family">Family Name</Radio>
                                    <Radio value="birthDate">Birth Date</Radio>
                                    <Radio value="extension">Extension</Radio>
                                    <Radio value="telecom">Telecom</Radio>
                                    <Radio value="maritalStatus">
                                        Marital Status
                                    </Radio>
                                    <Radio value="obs">Marital Status</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>
                    )}

                    <Table variant="simple" mt="20px">
                        <Thead>
                            <Tr>
                                <Th>System</Th>
                                <Th>Code</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data && data.mappings ? (
                                data.mappings.map((mapping: any) => (
                                    <Tr key={mapping.code}>
                                        <Td>{mapping.system}</Td>
                                        <Td>{mapping.code}</Td>
                                        <Td>
                                            <Button
                                                onClick={() =>
                                                    deleteMapping(mapping)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td>
                                        <pre>
                                            {JSON.stringify(data, null, 2)}
                                        </pre>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                    <Button
                        onClick={onOpen}
                        position="fixed"
                        width="50px"
                        h="50px"
                        bottom="40px"
                        right="40px"
                        borderRadius="50px"
                        textAlign="center"
                        boxShadow="2px 2px 3px #999"
                    >
                        <Icon as={FaPlus} />
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <Formik
                            initialValues={{ system: "", code: "" }}
                            validationSchema={
                                data.type === "extension"
                                    ? ExtensionSchema
                                    : MappingSchema
                            }
                            onSubmit={async (values, actions) => {
                                let mappings = data.mappings || [];
                                mappings = [...mappings, values];
                                const updated = {
                                    ...data,
                                    mappings,
                                    index,
                                    idField: "id",
                                };
                                await mutateAsync(updated);
                                actions.setSubmitting(false);
                                onClose();
                            }}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form>
                                    <ModalContent>
                                        <ModalHeader>New Mapping </ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <SimpleGrid columns={1} gap="10px">
                                                <Field name="system">
                                                    {({ field }: any) => (
                                                        <FormControl
                                                            isInvalid={
                                                                !!errors.system &&
                                                                touched.system
                                                            }
                                                        >
                                                            <FormLabel htmlFor="system">
                                                                System
                                                            </FormLabel>
                                                            <Input
                                                                {...field}
                                                                id="system"
                                                                placeholder="System"
                                                            />
                                                            <FormErrorMessage>
                                                                {errors.system}
                                                            </FormErrorMessage>
                                                        </FormControl>
                                                    )}
                                                </Field>
                                                {data.type !== "extension" && (
                                                    <Field name="code">
                                                        {({ field }: any) => (
                                                            <FormControl
                                                                isInvalid={
                                                                    !!errors.code &&
                                                                    touched.code
                                                                }
                                                            >
                                                                <FormLabel htmlFor="code">
                                                                    Code
                                                                </FormLabel>
                                                                <Input
                                                                    {...field}
                                                                    id="code"
                                                                    placeholder="Code"
                                                                />
                                                                <FormErrorMessage>
                                                                    {
                                                                        errors.code
                                                                    }
                                                                </FormErrorMessage>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                )}
                                            </SimpleGrid>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button
                                                colorScheme="blue"
                                                mr={3}
                                                onClick={onClose}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                isLoading={isSubmitting}
                                                variant="ghost"
                                                type="submit"
                                            >
                                                Add Mapping
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Form>
                            )}
                        </Formik>
                    </Modal>
                </Box>
            )}
            {isError && <Box>{error.message}</Box>}
        </>
    );
};

export default TerminologyDetails;

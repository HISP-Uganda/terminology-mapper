import { Spinner, Stack, Flex, HStack } from "@chakra-ui/react";
import {
    MakeGenerics,
    Outlet,
    ReactLocation,
    Route,
    Router,
    Link,
} from "@tanstack/react-location";

import Home from "./pages/Home";
import Terminologies from "./components/Terminologies";
import TerminologyDetails from "./components/TerminologyDetails";
import TerminologyForm from "./components/TerminologyForm";

export type LocationGenerics = MakeGenerics<{
    Params: {
        id: string;
        index: string;
    };
}>;

const location = new ReactLocation<LocationGenerics>();

const routes: Route<LocationGenerics>[] = [
    { path: "/", element: <Home /> },
    {
        path: "/:index",

        children: [
            { path: "/", element: <Terminologies /> },
            { path: "/form", element: <TerminologyForm /> },
            {
                path: "/:id",
                element: <TerminologyDetails />,
            },
        ],
    },
];

function Root() {
    return (
        <Stack>
            <Flex bg="#2b6cb0" p="2" h="4rem" color="white">
                <HStack
                    textTransform="uppercase"
                    spacing="24px"
                    fontSize="16px"
                >
                    <Link<LocationGenerics> to="/">Home</Link>
                    <Link<LocationGenerics> replace to="/concepts">
                        Concepts
                    </Link>
                    <Link<LocationGenerics> to="/attributes">Attributes</Link>
                    <Link<LocationGenerics> to="/programs">Programs</Link>
                    <Link<LocationGenerics> to="/entities">Entities</Link>
                    <Link<LocationGenerics> to="/stages">Stages</Link>
                    <Link<LocationGenerics> to="/organisations">
                        Organisations
                    </Link>
                </HStack>
            </Flex>
            <Stack p="10px">
                <Outlet />
            </Stack>
        </Stack>
    );
}

export default function App() {
    return (
        <Router
            location={location}
            routes={routes}
            defaultPendingElement={<Spinner />}
            defaultLinkPreloadMaxAge={0}
            defaultLoaderMaxAge={0}
            defaultPendingMs={2000}
            defaultPendingMinMs={1000}
        >
            <Root />
        </Router>
    );
}

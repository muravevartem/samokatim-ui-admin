import React from "react";
import {Outlet} from "react-router-dom";
import {Stack} from "@chakra-ui/react";
import {MainHeader} from "./components.js";

export default function () {
    return (
        <Stack bgColor='whitesmoke' minH='100vh'>
            <MainHeader fixed/>
            <Outlet/>
        </Stack>
    )
}

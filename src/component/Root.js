import React from "react";
import {Outlet} from "react-router-dom";
import {Stack} from "@chakra-ui/react";

export default function () {
    return (
        <Stack bgColor='whitesmoke' minH='100vh'>
            <Outlet/>
        </Stack>
    )
}
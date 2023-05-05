import {
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Link
} from "@chakra-ui/react";
import {IoMdEye, IoMdEyeOff, IoMdKey} from "react-icons/io";
import React, {useState} from "react";
import {routes} from "../routes.js";

export function MainHeader({fixed}) {
    return (
        <HStack p={4}
                justifyContent='space-between'
                position={fixed ? 'fixed' : 'relative'}
                bgColor='green.700'
                color='whitesmoke'
                zIndex={999}
                w='100%'>
            <Heading size='md'>
            </Heading>
            <Link href={routes.home}>
                На главную
            </Link>
        </HStack>
    )
}


export function InputPassword(props) {
    let [isHidden, setHidden] = useState(true);

    function changeMode() {
        if (props.onlyHidden) {
            setHidden(true)
        } else {
            setHidden(!isHidden)
        }
    }

    return (
        <InputGroup>
            {props.showLeftAddons &&
                <InputLeftAddon>
                    <IoMdKey/>
                </InputLeftAddon>
            }
            <Input type={isHidden ? 'password' : 'text'}
                   {...props}
            />
            {!props.onlyHidden &&
                <InputRightElement>
                    <IconButton aria-label='show password'
                                size={32}
                                onClick={changeMode}
                                icon={isHidden ? <IoMdEyeOff/> : <IoMdEye/>}
                    />
                </InputRightElement>
            }
        </InputGroup>
    )
}

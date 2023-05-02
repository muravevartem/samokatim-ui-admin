import React, {useEffect, useState} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Center,
    Divider,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Link,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import {IoMdEye, IoMdEyeOff, IoMdKey, IoMdMail} from "react-icons/io";
import isEmail from "validator/es/lib/isEmail.js";
import {userService} from "../service/UserService.js";
import {errorConverter} from "../error/ErrorConverter.js";
import {useNavigate} from "react-router-dom";
import {routes} from "../routes.js";
import {DEFAULT_EMAIL} from "./util.js";

export function SiginPage() {
    const [state, setState] = useState({
        username: '',
        password: '',
        showPass: false,
        loading: false
    })
    let [isOpenResetPassword, setOpenResetPassword] = useState(false);

    let toast = useToast();
    let navigate = useNavigate();

    useEffect(() => {
        if (userService.authenticated())
            navigate(-1)
    }, [])


    async function login() {
        try {
            setState({...state, loading: true})

            await userService.signin({
                username: state.username,
                password: state.password
            });

            navigate(routes.home)
        } catch (e) {
            toast({
                status: 'error',
                title: errorConverter.convert(e)
            })
            setState({...state, loading: false})
        }

    }


    return (
        <Center minH='100vh'>
            <Stack spacing={5}>
                <ResetPasswordDialog isOpen={isOpenResetPassword}
                                     onClose={() => setOpenResetPassword(false)}/>
                <Heading textAlign='center'>Самокатим.Бизнес</Heading>
                <InputGroup>
                    <InputLeftAddon>
                        <IoMdMail/>
                    </InputLeftAddon>
                    <Input placeholder={DEFAULT_EMAIL}
                           isInvalid={state.username !== '' && !isEmail(state.username)}
                           value={state.username}
                           onChange={e => setState({...state, username: e.target.value})}
                    />
                </InputGroup>
                <InputGroup>
                    <InputLeftAddon>
                        <IoMdKey/>
                    </InputLeftAddon>
                    <Input type={state.showPass ? 'text' : 'password'}
                           isInvalid={state.password !== '' && state.password.length < 6}
                           value={state.password}
                           onChange={e => setState({...state, password: e.target.value})}
                    />
                    <InputRightElement>
                        <IconButton aria-label='show password'
                                    onClick={() => setState({...state, showPass: !state.showPass})}
                                    icon={state.showPass ? <IoMdEye/> : <IoMdEyeOff/>}
                        />
                    </InputRightElement>
                </InputGroup>
                <Divider/>
                <Button colorScheme='green' onClick={login}>
                    Войти
                </Button>
                <HStack justifyContent='center'>
                    <Link href={routes.creation}
                          color='green'
                          fontWeight='bolder'>
                        Зарегистрироваться
                    </Link>
                </HStack>
                <HStack justifyContent='center'>
                    <Link onClick={() => setOpenResetPassword(true)}>
                        Сбросить пароль
                    </Link>
                </HStack>
            </Stack>
        </Center>
    )
}


function ResetPasswordDialog({isOpen, onClose}) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    async function resetPassword() {
        try {
            setLoading(true);
            await userService.resetPassword({
                email: email
            });
            toast({
                status: 'success',
                title: 'Выслано подтверждение на почтовый адрес',
                description: email,
                duration: 12000,
                isClosable: true
            })
            onClose();
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog
            motionPreset='slideInBottom'
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay/>

            <AlertDialogContent>
                <AlertDialogHeader>Сброс пароля</AlertDialogHeader>
                <AlertDialogCloseButton/>
                <AlertDialogBody>
                    <Stack>
                        <Text fontWeight='bolder'>Адрес электронной почты</Text>
                        <InputGroup>
                            <InputLeftAddon>
                                <IoMdMail/>
                            </InputLeftAddon>
                            <Input value={email}
                                   placeholder={DEFAULT_EMAIL}
                                   onChange={e => setEmail(e.target.value)}
                                   isInvalid={!isEmail(email)}/>
                        </InputGroup>
                    </Stack>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button onClick={resetPassword}
                            isActive={isEmail(email) && !loading}>
                        Готово
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

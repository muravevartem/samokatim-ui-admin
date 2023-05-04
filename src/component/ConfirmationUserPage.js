import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import isNumeric from "validator/es/lib/isNumeric.js";
import {routes} from "../routes.js";
import {
    Button,
    Center,
    Collapse,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    PinInput,
    PinInputField,
    Skeleton,
    Stack,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {InputPassword} from "./components.js";
import {userService} from "../service/UserService.js";
import {errorConverter} from "../error/ErrorConverter.js";

export function ConfirmationUserPage() {
    let [state, setState] = useState({
        password: '',
        confirmPassword: '',
        code: ''
    });
    let [loading, setLoading] = useState(false);

    let {id} = useParams();
    let navigate = useNavigate();
    let toast = useToast();

    useEffect(() => {
        if (!isNumeric(id))
            navigate(routes["404"])
    }, [])


    async function setNewPassword() {
        try {
            setLoading(loading);
            await userService.completeInvite(id, {
                password: state.password,
                code: state.code
            })
            toast({
                status: 'success',
                title: 'Пароль успешно изменен',
                duration: 120000,
                isClosable: true
            })
            navigate(routes.signin);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }

    return (
        <Center minH='100vh'>
            <VStack spacing={4}>
                <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                      bgClip="text"
                      fontSize="3xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    Изменение пароля
                </Text>
                <div style={{height: 30}}/>
                <Stack>
                    <FormControl>
                        <FormLabel>Код подтверждения</FormLabel>
                        <HStack>
                            <PinInput type='alphanumeric'
                                      onChange={code => setState({
                                          ...state,
                                          code: code
                                      })}
                                      value={state.code}>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                            </PinInput>
                        </HStack>
                    </FormControl>
                </Stack>
                <Collapse in={state.code.length === 8} animateOpacity>
                    <Stack w='100%'>
                        <FormControl>
                            <FormLabel>Введите новый пароль</FormLabel>
                            <InputPassword
                                onlyHidden
                                value={state.password}
                                onChange={e => setState({
                                    ...state,
                                    password: e.target.value
                                })}
                                isInvalid={state.password < 6}
                            />
                            <FormHelperText >Длина не менее 6 символов</FormHelperText>
                        </FormControl>

                        <Divider/>
                        <FormControl>
                            <FormLabel>Повторите пароль</FormLabel>
                            <InputPassword
                                onlyHidden
                                value={state.confirmPassword}
                                onChange={e => setState({
                                    ...state,
                                    confirmPassword: e.target.value
                                })}
                                isInvalid={state.confirmPassword !== state.password}
                            />
                        </FormControl>
                        <div style={{height: 30}}/>
                        <Skeleton isLoaded={!loading}>
                            <HStack justifyContent='center'>
                                <Button onClick={() => navigate(routes.signin)}>
                                    Отмена
                                </Button>
                                <Button colorScheme='blue'
                                        isDisabled={
                                            state.password.length < 6
                                            || state.confirmPassword !== state.password
                                            || state.code.length !== 8
                                        }
                                        onClick={setNewPassword}>
                                    Изменить
                                </Button>
                            </HStack>
                        </Skeleton>
                    </Stack>
                </Collapse>
            </VStack>
        </Center>
    )

}

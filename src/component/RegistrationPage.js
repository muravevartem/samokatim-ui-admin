import React, {useState} from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    Center,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Link,
    Skeleton,
    Stack,
    Text,
    Textarea,
    useToast,
    VStack
} from "@chakra-ui/react";
import {IoMdMail, IoMdPhonePortrait} from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {routes} from "../routes";
import {organizationService} from "../service/OrganizationService.js";
import isEmail from "validator/es/lib/isEmail.js";
import isMobilePhone from "validator/es/lib/isMobilePhone.js";
import isVAT from "validator/es/lib/isVAT.js";
import {errorConverter} from "../error/ErrorConverter.js";


export function RegistrationPage() {
    const [step, setStep] = useState(0);
    const [company, setCompany] = useState();

    function onNext() {
        setStep(step + 1)
    }

    function onPrev() {
        setStep(step - 1)
    }

    const steps = [
        (<RegPageStep0 onNext={onNext}/>),
        (<RegPageStep1 onPrev={onPrev} onNext={onNext} onLoadCompany={setCompany}/>),
        (<RegPageStep2 company={company} onChange={setCompany} onPrev={onPrev} onNext={onNext}/>),
        (<RegPageStep3 company={company}/>)
    ]

    console.log(step)

    return (
        <Box bgColor='green.50'>
            {steps[step]}
        </Box>
    );
}

function RegPageStep0({onNext}) {
    return (
        <Stack minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} p={4}>
                    <Heading textAlign='center'>Стань частью прокат</Heading>
                    <Text textAlign='center'>Для этого зарегистрируй свою организацию и имеющееся оборудование</Text>
                    <Button colorScheme='green' onClick={onNext}>Зарегистроваться</Button>
                </VStack>
            </Center>
        </Stack>
    )
}

function RegPageStep1({onPrev, onNext, onLoadCompany}) {

    const [inn, setInn] = useState('');
    const toast = useToast();

    async function loadByInn() {
        try {
            let company = await organizationService.getByInn(inn);

            onLoadCompany(company)

            if (onNext) {
                onNext()
            }
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }

    return (
        <Stack minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} bgColor='white' p={6} rounded={5}>
                    <Heading>Базовая информации</Heading>

                    <InputGroup>
                        <InputLeftAddon children='ИНН'/>
                        <Input value={inn}
                               isInvalid={!isVAT(inn, 'RU')}
                               onChange={e => setInn(e.target.value)}/>
                    </InputGroup>


                    <ButtonGroup>
                        <Button onClick={onPrev}>
                            Назад
                        </Button>
                        <Button colorScheme='green'
                                isDisabled={!isVAT(inn, 'RU')}
                                onClick={loadByInn}>
                            Далее
                        </Button>
                    </ButtonGroup>
                </VStack>
            </Center>
        </Stack>
    )
}

function RegPageStep2({company, onChange, onPrev, onNext}) {
    let toast = useToast();
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        try {
            setLoading(true)
            let createdCompany = await organizationService.register(company)
            onChange(createdCompany);
            toast({
                status: "success",
                title: 'Огранизация успешно зарегистровано',
                description: `На почтовый адрес ${createdCompany.email} выслано приглашение`
            })
            setTimeout(() => {
                if (onNext)
                    onNext()
            }, 3000)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e));
            setLoading(false)
        }
    }

    return (
        <Stack minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} bgColor='white' p={6} rounded={5}>
                    <Heading>Подтверждение данных</Heading>

                    <InputGroup>
                        <InputLeftAddon children='Название'/>
                        <Input disabled={true} value={company.name} onChange={e => onChange({
                            ...company,
                            name: e.target.value
                        })}/>
                    </InputGroup>
                    <InputGroup>
                        <Textarea disabled={true} value={company.fullName} onChange={e => onChange({
                            ...company,
                            fullName: e.target.value
                        })}/>
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon children='ИНН'/>
                        <Input disabled={true} value={company.inn} onChange={e => onChange({
                            ...company,
                            inn: e.target.value
                        })}/>
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon children='КПП'/>
                        <Input disabled={true} value={company.kpp} onChange={e => onChange({
                            ...company,
                            kpp: e.target.value
                        })}/>
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon children={<IoMdPhonePortrait/>}/>
                        <Input value={company.tel}
                               isInvalid={!isMobilePhone(company.tel ?? '', 'ru-RU')}
                               placeholder='79871234567'
                               onChange={e => onChange({
                                   ...company,
                                   tel: e.target.value
                               })}/>
                    </InputGroup>

                    <InputGroup>
                        <InputLeftAddon children={<IoMdMail/>}/>
                        <Input value={company.email}
                               isInvalid={!isEmail(company.email ?? '')}
                               placeholder='mail@mail.com'
                               onChange={e => onChange({
                                   ...company,
                                   email: e.target.value
                               })}/>
                    </InputGroup>

                    <Skeleton isLoaded={!loading}>
                        <ButtonGroup>
                            <Button onClick={onPrev}>
                                Назад
                            </Button>
                            <Button colorScheme='green'
                                    isDisabled={
                                        !isEmail(company.email ?? '')
                                        || !isMobilePhone(company.tel ?? '', 'ru-RU')
                                    }
                                    onClick={onSubmit}>
                                Готово
                            </Button>
                        </ButtonGroup>
                    </Skeleton>
                </VStack>
            </Center>
        </Stack>
    )
}

function RegPageStep3({company}) {
    let navigate = useNavigate();


    return (
        <Stack bgColor='green.50' minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} p={4}>
                    <Alert
                        status='success'
                        variant='subtle'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        textAlign='center'
                        height='200px'
                        rounded={10}
                    >
                        <AlertIcon boxSize='40px' mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize='lg'>
                            На почтовый адрес {company.email} выслано приглашение.
                        </AlertTitle>
                        <AlertDescription maxWidth='md'>
                            <VStack>
                                <Text>
                                    Приглашение действительно 15 минут.
                                    По истечению указанного срока потребуется выполнить процедуру сброса пароля
                                </Text>
                                <Link href={routes.signin} textDecor='underline'>
                                    На страницу авторизации
                                </Link>
                            </VStack>
                        </AlertDescription>
                    </Alert>
                </VStack>
            </Center>
        </Stack>
    )
}

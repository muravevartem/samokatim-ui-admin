import React, {useState} from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    ButtonGroup,
    Center,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    Link,
    Stack,
    Text,
    Textarea,
    useToast,
    VStack
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {routes} from "../routes";
import {organizationService} from "../service/OrganizationService.js";
import isEmail from "validator/es/lib/isEmail.js";
import isMobilePhone from "validator/es/lib/isMobilePhone.js";
import isVAT from "validator/es/lib/isVAT.js";
import {errorConverter} from "../error/ErrorConverter.js";
import isEmpty from "validator/es/lib/isEmpty.js";
import {DEFAULT_EMAIL} from "./util.js";


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

    return steps[step];
}

function RegPageStep0({onNext}) {
    return (
        <Stack minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} p={4}>
                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                          bgClip='text'
                          p={2}
                          fontSize="6xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        Стань частью проката
                    </Text>
                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                          bgClip='text'
                          p={2}
                          fontSize="2xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        Для этого зарегистрируй свою организацию и имеющееся оборудование
                    </Text>
                    <Button colorScheme='brand'
                            onClick={onNext}>
                        Зарегистроваться
                    </Button>
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
                <VStack spacing={6} p={6} rounded={5}>
                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                          bgClip='text'
                          p={2}
                          fontSize="4xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        Основная информация
                    </Text>

                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                ИНН
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Input value={inn}
                                   fontWeight='bolder'
                                   onChange={e => setInn(e.target.value)}/>
                        </InputGroup>
                        <FormHelperText>
                            Индивидуальный номер налогоплательщика
                        </FormHelperText>
                    </FormControl>


                    <ButtonGroup>
                        <Button onClick={onPrev}>
                            Назад
                        </Button>
                        <Button colorScheme='brand'
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
                <VStack spacing={6}>
                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                          bgClip='text'
                          p={2}
                          fontSize="4xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        Контактная информация
                    </Text>
                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                Название
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Input fontWeight='bold'
                                   value={company.name}/>
                        </InputGroup>
                        <FormHelperText>
                            Загружено из внешнего справочника
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                Полное наименование
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Textarea fontWeight='bold' value={company.fullName}/>
                        </InputGroup>
                        <FormHelperText>
                            Загружено из внешнего справочника
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                ИНН
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Input fontWeight='bold' value={company.inn}/>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                КПП
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Input fontWeight='bold' value={company.kpp ? company.kpp : 'Отсутствует'}/>
                        </InputGroup>
                        <FormHelperText>
                            Загружено из внешнего справочника
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                Номер телефона
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Input value={company.tel??''}
                                   fontWeight='bold'
                                   isInvalid={!isEmpty(company.tel??'') && !isMobilePhone(company.tel ?? '', 'ru-RU')}
                                   placeholder='79871234567'
                                   onChange={e => onChange({
                                       ...company,
                                       tel: e.target.value
                                   })}/>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                Адрес электронной почты
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Input value={company.email??''}
                                   fontWeight='bold'
                                   isInvalid={!isEmpty(company.email??'') && !isEmail(company.email ?? '')}
                                   placeholder={DEFAULT_EMAIL}
                                   onChange={e => onChange({
                                       ...company,
                                       email: e.target.value
                                   })}/>
                        </InputGroup>
                    </FormControl>

                    <ButtonGroup isDisabled={loading}>
                        <Button onClick={onPrev}>
                            Назад
                        </Button>
                        <Button colorScheme='brand'
                                isDisabled={
                                    !isEmail(company.email ?? '')
                                    || !isMobilePhone(company.tel ?? '', 'ru-RU')
                                }
                                onClick={onSubmit}>
                            Готово
                        </Button>
                    </ButtonGroup>
                </VStack>
            </Center>
        </Stack>
    )
}

function RegPageStep3({company}) {
    let navigate = useNavigate();


    return (
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
                    <AlertIcon boxSize='40px' mr={0}/>
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                        На почтовый адрес {company.email} выслано приглашение
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
    )
}

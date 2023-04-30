import React, {useState} from "react";
import {
    Alert, AlertIcon,
    Button,
    ButtonGroup,
    Center,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Skeleton,
    Stack,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {companyService} from "../service/CompanyService";
import {IoMdMail, IoMdPhonePortrait} from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {routes} from "../routes";


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
        <Stack bgColor='green.50' minH='100vh'>
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
            let company = await companyService.getByInn(inn)
            onLoadCompany(company)
            if (onNext){
                onNext()
            }
        } catch (e) {
            console.log(e)
            toast({
                status: 'error',
                title: 'Ошибка при сохранении ИНН'
            })
        }
    }

    return (
        <Stack minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} bgColor='white' p={6} rounded={5}>
                    <Heading>Базовая информации</Heading>

                    <InputGroup>
                        <InputLeftAddon children='ИНН'/>
                        <Input value={inn} onChange={e=>setInn(e.target.value)}/>
                    </InputGroup>


                    <ButtonGroup>
                        <Button onClick={onPrev}>
                            Назад
                        </Button>
                        <Button colorScheme='green' onClick={loadByInn}>
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
            let createdCompany = await companyService.register(company)
            onChange(createdCompany);
            if (onNext)
                onNext()
        } catch (e) {
            console.log(e)
            toast({
                status: 'error',
                title: 'Ошибка создания организации'
            })
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
                        <InputLeftAddon children='ИНН'/>
                        <Input disabled={true} value={company.inn} onChange={e => onChange({
                            ...company,
                            inn: e.target.value
                        })}/>
                    </InputGroup>

                    <InputGroup>
                        <InputLeftAddon children={<IoMdPhonePortrait/>}/>
                        <Input value={company.tel}
                               placeholder='79871234567'
                               onChange={e => onChange({
                                   ...company,
                                   tel: e.target.value
                               })}/>
                    </InputGroup>

                    <InputGroup>
                        <InputLeftAddon children={<IoMdMail/>}/>
                        <Input value={company.email}
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

function RegPageStep3() {
    let navigate = useNavigate();


    return (
        <Stack bgColor='green.50' minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} p={4}>
                    <Heading textAlign='center'>
                        Личный кабинет создан
                    </Heading>
                    <Text textAlign='center'>
                        При первой аунтентфикации потребуется ввести адрес электронной почты
                    </Text>
                    <Alert variant='info'>
                        <AlertIcon/>
                        Для отображения компании на площадке система отправлена на верификацию
                    </Alert>
                    <Button colorScheme='green' onClick={()=>navigate(routes.home)}>
                        Перейти в личный кабинет
                    </Button>
                </VStack>
            </Center>
        </Stack>
    )
}
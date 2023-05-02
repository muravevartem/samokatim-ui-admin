import {Navigate, useNavigate} from "react-router-dom";
import {userService} from "../service/UserService.js";
import {routes} from "../routes.js";
import {useEffect, useState} from "react";
import {events, eventService} from "../service/EventService.js";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text
} from "@chakra-ui/react";

export default function ({children, roles}) {
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    let navigate = useNavigate();

    async function loadCurrentUser() {
        try {
            setLoading(true)
            let currentUser = await userService.me();
            let roles = currentUser.roles;
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!userService.authenticated())
            return <Navigate to={routes.signin}/>
        loadCurrentUser();
        eventService.subscribe(events.logout, () => navigate(routes.signin))
    }, [])

    if (loading) {
        return (
            <Center minH='100vh'>
                <CircularProgress isIndeterminate/>
            </Center>
        )
    }

    return (
        <Box>
            {children}
           <ChangePasswordModal isOpen={openModal} onClose={() => setOpenModal(false)}/>
        </Box>);
}

function ChangePasswordModal({isOpen, onClose}) {
    let [newPassword, setNewPassword] = useState("");
    return (
        <Modal
            isCentered
            onClose={()=>{}}
            isOpen={isOpen}
            motionPreset='slideInBottom'
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Использован временный пароль</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        <Stack>
                            <Text>Временный пароль требует замены</Text>
                            <Input value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                        </Stack>
                    </Center>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='green'>Сохранить</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

import logo from './logo.svg';
import './App.css';
import {ChakraProvider} from "@chakra-ui/react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routes";
import moment from "moment";
import 'moment/locale/ru'

moment.locale('ru')

function App() {
    return (
        <ChakraProvider>
            <RouterProvider router={router}/>
        </ChakraProvider>
    );
}

export default App;

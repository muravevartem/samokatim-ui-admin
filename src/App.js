import './App.css';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routes";
import moment from "moment";
import 'moment/locale/ru'

moment.locale('ru')

const theme = extendTheme({
    colors: {
        brand: {
            100: '#C8E6C9',
            200: '#A5D6A7',
            300: '#81C784',
            400: '#66BB6A',
            500: '#4CAF50',
            600: '#43A047',
            700: '#388E3C',
            800: '#2E7D32',
            900: '#1B5E20'
        }
    }
})
function App() {
    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router}/>
        </ChakraProvider>
    );
}

export default App;

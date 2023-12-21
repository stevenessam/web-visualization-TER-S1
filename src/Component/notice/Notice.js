import './Notice.css';

import { Container } from 'react-bootstrap';
import Abstract from './Abstract';
import Footer from '../Footer';
import Descriptors from './Descriptors';
import NavBar from '../NavBar';
import Metadata from "./Metadata";
import MapComponent from "./Map";

/**
 * Entry point of the notice page
 *
 * @return {JSX.Element}
 * @constructor
 */
function Notice() {
    return (
        <Container fluid="lg">
            <NavBar />
            <Metadata />
            <Abstract />
            <Footer />
        </Container>
    );
}

export default Notice;

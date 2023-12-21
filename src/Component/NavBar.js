import { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo_d2kab from '../images/logo_d2kab.png';
import logo_d2kab2 from '../images/logo_d2kab2.png';
import { Link } from "react-router-dom";


class NavBar extends Component {

    render() {
        return (
            <Navbar bg="" variant="">
                <Navbar.Brand href=""></Navbar.Brand>
                <img className="mt-4 me-5" id="logo_d2kab" src={logo_d2kab} alt="D2KAB"></img>
                <div className="mt-4 me-0 col-sm-3">
                    This interface developed by the <a href="https://d2kab.mystrikingly.com/">D2KAB</a>.
                </div>
                <img className="mt-4 mx-3" id="logo_d2kab2" src={logo_d2kab2} alt="logod2kab2"></img>
                <Nav className="mr-auto flex-column">
                    <Nav.Item>
                        <Link to="/search">Search</Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        )
    }
}

export default NavBar;

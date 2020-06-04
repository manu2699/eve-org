import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { FaUserCog } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import logo from "../assets/logo.png";
import { RiLogoutBoxRLine, RiLoginBoxLine } from "react-icons/ri";
const NavBar = (props) => {
  useEffect(() => {
    console.log(props)
  })
  return (
    <div className="navbar">
      <NavLink className="li" exact to="/" activeClassName="selected">
        <FiHome className="icon" />
        <h6>Home</h6>
      </NavLink>
      <NavLink className="li" exact to="/dashboard" activeClassName="selected">
        <RiDashboardLine className="icon" />
        <h6>Dashboard</h6>
      </NavLink>
      <NavLink className="li" exact to="/Profile" activeClassName="selected">
        <FaUserCog className="icon" />
        <h6>Profile</h6>
      </NavLink>
      <NavLink className="li" exact to="/log" activeClassName="selected">
        <RiLoginBoxLine className="icon" />
        <h6>Login</h6>
      </NavLink>
      {/* <div className="li">< RiLogoutBoxRLine  size="30px" color="white" /> </div> */}
    </div>
  )
}
export default NavBar;
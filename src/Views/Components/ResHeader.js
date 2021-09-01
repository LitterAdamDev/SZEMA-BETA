import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    Button,
    IconButton,
    Drawer,
    Link,
    MenuItem,
  } from "@material-ui/core";
  import MenuIcon from "@material-ui/icons/Menu";
  import React, { useState, useEffect } from "react";
  import { Link as RouterLink } from "react-router-dom";
  import "firebase/auth";
  import firebase from "firebase/app";
  const handleLogout = () => {
    firebase.auth().signOut();
  };
  const headersData = [
    {
      label: "Hírek",
      href: "/news",
    },
    {
      label: "Kérdésbázis",
      href: "/questionbase",
    },
    {
      label: "Feladatsorok",
      href: "/createtest",
    },
    {
      label: "Kijelentkezés",
      href: "",
    },
  ];
  
  const useStyles = makeStyles(() => ({
    header: {
      backgroundColor: "#1c2442",
      paddingRight: "79px",
      paddingLeft: "118px",
      "@media (max-width: 900px)": {
        paddingLeft: 0,
      },
    },
    logo: {
      fontFamily: "Work Sans, sans-serif",
      fontWeight: 600,
      color:  document.location.pathname === "/"? "#ffffff" : "#a9acb8",
      textAlign: "left",
      textDecoration: "none",
      cursor: "pointer"
    },
    menuButton: {
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 700,
      size: "18px",
      color: "#a9acb8",
      marginLeft: "38px",
    },
    activLink: {
        fontWeight: 900,
        color: "#000000",
        textDecoration: "none"
    },
    menuButtonActiv: {
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 700,
      size: "18px",
      color: "#ffffff",
      marginLeft: "38px",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
    },
    drawerContainer: {
      padding: "20px 30px",
    },
  }));
  
  export default function Header() {
    const { header, logo, menuButton, activLink, menuButtonActiv, toolbar, drawerContainer } = useStyles();
  
    const [state, setState] = useState({
      mobileView: false,
      drawerOpen: false,
    });
  
    const { mobileView, drawerOpen } = state;
  
    useEffect(() => {
      const setResponsiveness = () => {
        return window.innerWidth < 1000
          ? setState((prevState) => ({ ...prevState, mobileView: true }))
          : setState((prevState) => ({ ...prevState, mobileView: false }));
      };
  
      setResponsiveness();
  
      window.addEventListener("resize", () => setResponsiveness());
  
      return () => {
        window.removeEventListener("resize", () => setResponsiveness());
      };
    }, []);
  
    const displayDesktop = () => {
      return (
        <Toolbar className={toolbar}>
          {siteName}
          <div>{getMenuButtons()}</div>
        </Toolbar>
      );
    };
  
    const displayMobile = () => {
      const handleDrawerOpen = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: true }));
      const handleDrawerClose = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: false }));
  
      return (
        <Toolbar>
          <IconButton
            {...{
              edge: "start",
              color: "inherit",
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon />
          </IconButton>
  
          <Drawer
            {...{
              anchor: "left",
              open: drawerOpen,
              onClose: handleDrawerClose,
            }}
          >
            <div className={drawerContainer}>{getDrawerChoices()}</div>
          </Drawer>
  
          <div>{siteName}</div>
        </Toolbar>
      );
    };
  
    const getDrawerChoices = () => {
      return headersData.map(({ label, href }) => {
        return (
          <Link
            {...{
              component: RouterLink,
              to: label === 'Kijelentkezés'? '' : href,
              color: "inherit",
              class: document.location.pathname === href? activLink : null,
              onClick: label === 'Kijelentkezés'? handleLogout:null,
              style: {textDecoration: "none"},
              key: label,
            }}
          >
            <MenuItem>{label}</MenuItem>
          </Link>
        );
      });
    };
  
    const siteName = (
      <Typography variant="h6" component="h1" >
        <Link 
        href="/"
        className={logo}
        style = {{color:  document.location.pathname === "/"? "#ffffff" : "#a9acb8"}}
        > 
          SZEMA-BETA
        </Link>
      </Typography>
    );
  
    const getMenuButtons = () => {
      return headersData.map(({ label, href }) => {
        return (
          <Button
            {...{
              key: label,
              color: "inherit",
              to: label === 'Kijelentkezés'? '' : href,
              onClick: label === 'Kijelentkezés'? handleLogout:null,
              component: RouterLink,
              className: document.location.pathname === href? menuButtonActiv : menuButton,
            }}
          >
            {label}
          </Button>
        );
      });
    };
  
    return (
        <AppBar className={header}>
          {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
    );
  }
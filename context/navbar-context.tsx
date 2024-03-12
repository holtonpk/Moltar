"use client";

import React, {useContext, createContext, useEffect, useState} from "react";

const NavbarContext = createContext<NavbarContextType | null>(null);

export function useNavbar() {
  return useContext(NavbarContext);
}

interface Props {
  children?: React.ReactNode;
}

interface NavbarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const NavbarProvider = ({children}: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const values = {
    collapsed,
    setCollapsed,
  };

  return (
    <NavbarContext.Provider value={values}>{children}</NavbarContext.Provider>
  );
};

export default NavbarContext;

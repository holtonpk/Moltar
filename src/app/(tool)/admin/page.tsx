"use client";

import React from "react";
import {useAuth} from "@/context/user-auth";
import DataDisplay from "./data-display";
const AdminPage = () => {
  const {currentUser} = useAuth()!;

  if (
    currentUser?.uid === "raqDXiZqRmSYPDZ5VmzMIQdzNmv2" ||
    currentUser?.uid === "Ohkl3qTSzyNfCL4SKQYwwx4K1x32"
  ) {
    return <DataDisplay />;
  }

  return <div>Unauthorized</div>;
};

export default AdminPage;

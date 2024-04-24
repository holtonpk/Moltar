"use client";
import {Icons} from "@/components/icons";
import React, {useState, useEffect} from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

import {collection, query, onSnapshot, getDocs} from "firebase/firestore";
import {db} from "@/config/firebase";
const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, `users`));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        // Added async here
        const userData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            // Used Promise.all and added async here
            const data = doc.data();

            const projectsQ = query(
              collection(db, `users/${data.uid}/projects`)
            );

            const projectSnapshot = await getDocs(projectsQ);
            const projects = projectSnapshot.docs.map((doc) => doc.data());

            const uploadsQ = query(
              collection(db, `users/${data.uid}/uploads`) // Corrected the path to uploads
            );

            const querySnapshot = await getDocs(uploadsQ);
            const uploads = querySnapshot.docs.map((doc) => doc.data());

            return {
              ...data,
              projects: projects,
              uploads: uploads,
            };
          })
        );

        setData(userData);
        setLoading(false);
      });

      // Cleanup this component
      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="bg-background h-fit max-h-none min-h-screen w-screen dark p-10  text-primary grid grid-cols-[60%_40%] items-center gap-6 ">
      <div className="flex flex-col gap-4">
        <div className="border p-3 rounded-md text-xl w-fit">
          Total Users: {data.length}
        </div>
        <div className="border border-border rounded-lg w-full flex flex-col ">
          <div className="w-full flex p-2 bg-primary/5">
            {/* <div className="w-[350px]">id</div> */}
            <div className="w-[200px]">Name</div>
            <div className="w-[300px]">email</div>
            <div className="w-[200px]">total projects</div>
            <div className="w-[200px]">total uploads</div>
          </div>
          <div className="h-[500px] w-full flex flex-col overflow-scroll ">
            {loading ? (
              <Icons.spinner className="animate-spin h-10 w-10 m-auto" />
            ) : (
              <>
                {data.map((d, i) => (
                  <div
                    onClick={() => setSelectedUser(d)}
                    className="w-full flex  border p-2 hover:bg-primary/5 cursor-pointer"
                  >
                    {/* <div className="font-medium w-[350px] ">
                      {d?.uid || "not signed in"}
                    </div> */}
                    <div className="w-[200px] text-left ">
                      {d?.firstName + " " + d?.lastName || "not signed in"}
                    </div>
                    <div className="w-[300px]">
                      {d?.email || "not signed in"}
                    </div>
                    <div className="w-[200px]">{d?.projects.length}</div>
                    <div className="w-[200px]">{d?.uploads.length}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <SelectedUser user={selectedUser} />
    </div>
  );
};

export default DataDisplay;

const SelectedUser = ({user}: {user: any}) => {
  return (
    <div className="w-full border rounded-md p-4 h-full">
      {!user ? (
        <>selcted a user</>
      ) : (
        <div className="flex flex-col">
          <div className="font-bold text-xl">
            {user?.firstName + " " + user?.lastName || "not signed in"}
          </div>

          <div>{user.uid}</div>
          <div>{user.email}</div>
          <div className="font-bold  text-xl mt-4">Uploads</div>
          <div className="flex flex-col gap-2 mt-2 max-h-[200px] overflow-scroll border rounded-md">
            {user.uploads.map((upload: any) => (
              <div className="flex gap-4 p-3 border border-y">
                {upload.type}
                <Link
                  href={upload?.path || upload?.url}
                  target="_blank"
                  className="hover:text-theme-blue"
                >
                  {upload.title}
                </Link>
              </div>
            ))}
          </div>
          <div className="font-bold  text-xl mt-4">Projects</div>
          <div className="flex flex-col gap-2 mt-2 max-h-[200px] overflow-scroll border rounded-md ">
            {user.projects
              .filter((p: any) => p.name)
              .map((project: any) => (
                <div className="flex gap-4 p-3 border-y">
                  {project?.name || "null"}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

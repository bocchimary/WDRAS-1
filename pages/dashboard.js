import Head from "next/head";
import Navbar from "../components/Navbar";
import Sidebar from "../components/admin/Sidebar";
import FormModal from "../components/admin/Adddispensermodal";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@/styles/Home.module.css";
import Dashboard from "../components/admin/dashboard";

import Main from "../components/admin/main";
export default function AdminDashboard() {
  const router = useRouter();


  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Redirect to the login page if token is not found
          router.push("/login");
        } else {
          const response = await fetch("/api/auth/check-auth", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (!response.ok) {
            // Redirect to the login page if the token is invalid
            router.push("/login");
          } else {
            // Set the user data
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Clear token and redirect to the login page
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://192.168.243.178:3002/device")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString();

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No user data</p>;

  return (
    
    <div className={styles.container}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={styles.movingTextContainer}>
  <div className={styles.movingText} style={{ width: '100%' }}>
    <h3>Welcome to the Admin Dashboard!</h3>
    </div>
  </div>
      <h1 className="text-white bg-black">Admin, Welcome to Dashboard</h1>
      <p className="text-white">{formattedDateTime}</p>
      <div className="row">
        <div className="col-lg-13 col-md-12 d-flex">
      
       <Main />
        
  
        </div>
       

            </div>
          </div>
   
  );
}

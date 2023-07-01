import { useState, useContext, useEffect } from "react";
//next
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
// global context
import { GlobalContext } from "../components/utils/globalContext";
//uuid
import { v4 as uuid4 } from "uuid";
// api routes
import * as pscaleAPI from "../constants/node-api";

function UserRegistration() {
  //router
  const router = useRouter();

  //global context
  const { userName, setUserName, setCurrentUserId } = useContext(GlobalContext);

  //local states
  const [email, setEmail] = useState("");
  const [sessionOTP, setSessionOTP] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoader(true);
    if (!email || !userName) return;
    fetch(pscaleAPI.USER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userName,
        email: email,
        unique_id: uuid4(),
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((response) => {
        window.sessionStorage.setItem("quiz_user_email", email);
        window.sessionStorage.setItem("admin_key", adminKey);
        window.sessionStorage.setItem("session_otp", sessionOTP);
        setCurrentUserId(response.data.id);
        setLoader(false);
        router.push("/welcome");
      })
      .catch((err) => {
        setLoader(false);
        // Catch and display errors
      });
  };

  return (
    <div className="max-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Dinqiz Registration Page</title>
      </Head>
      <div className="flex flex-col items-center">
        <div>
          <Image
            src="/static/dinanc_logo.png"
            alt="Logo"
            width={180}
            height={180}
          />
        </div>
        <div className="max-w-md w-full ">
          <div>
            <h2 className="text-center text-3xl font-semibold text-gray-900">
              Dinqiz User Registration
            </h2>
          </div>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm ">
              <div className="my-4">
                <label>User Name</label>
                <input
                  id="user-name"
                  name="user_name"
                  type="text"
                  required
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  className="rounded-none w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="User name..."
                />
              </div>
              <div className="my-4">
                <label>Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-none  w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address..."
                />
              </div>
              <div className="my-4">
                <label>Session OTP</label>
                <input
                  id="session-otp"
                  name="session_otp"
                  type="session_otp"
                  required
                  value={sessionOTP}
                  onChange={(event) => setSessionOTP(event.target.value)}
                  className=" rounded-none  w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Session OTP..."
                />
              </div>
            </div>

            <div className="my-8">
              <label>{"Admin Key (for admin only)"}</label>
              <input
                id="admin_key"
                name="admin_key"
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Admin Key"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xl font-semibold font bg-green-500 rounded-xl"
              >
                {`${loader ? "Submitting..." : "Submit"}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;

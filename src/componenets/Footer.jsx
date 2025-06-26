import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

function Footer() {
  return (
    <footer className="flex flex-col w-full px-5 py-6 text-white bg-indigo-900 gap-y-3 md:px-5 lg:px-25">
      <div className="flex flex-col items-center md:flex-row md:justify-between gap-y-4">
        <div className="flex flex-col  text-center items-center lg:items-start lg:text-start">
          <h1 className="text-2xl font-bold">
            Attendance Management System
          </h1>
          <p className="pl-1.5 text-sm lg:text-base text-neutral-200 w-3/4 lg:w-1/2  text-center items-center lg:items-start lg:text-start">
            Manage your attendance records and leave requests easily with our
            system. Designed for students and staff to track presence, absence and more.
          </p>
        </div>
        <div className="flex flex-col gap-y-1.5  text-center items-center lg:items-start lg:text-start">
          <h1 className="text-lg font-bold">Contact Us</h1>
          <ul className="flex flex-col gap-y-0.5 pl-1.5">
            <li className="text-sm md:text-base text-neutral-100">
              Email:{" "}
              <a
                href="mailto:support@attendance-system.edu"
                className="text-xs md:text-sm text-neutral-100 hover:underline"
              >
                support@attendance-system.edu
              </a>
            </li>
            <li className="text-sm md:text-base text-neutral-100">
              Phone:{" "}
              <span className="text-xs md:text-sm text-neutral-100">
                +966 55 987 6543
              </span>
            </li>
            <li className="text-sm md:text-base text-neutral-100">
              Address:{" "}
              <span className="text-xs md:text-sm text-neutral-100">
                Riyadh, Saudi Arabia
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center w-full md:justify-end gap-x-4">
        <FaDiscord className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
        <FaGithub className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
        <FaFacebook className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
        <FaInstagram className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
        <FaLinkedin className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
        <FaXTwitter className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
      </div>
      <div className="text-center text-neutral-200">
        <p className="text-xs md:text-sm">
          © 2025 Attendance Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

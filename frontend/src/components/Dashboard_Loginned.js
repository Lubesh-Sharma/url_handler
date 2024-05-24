import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { IoCopy } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { IoIosArrowDropdown } from "react-icons/io";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const Dashboard_Loginned = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });
  const [urls, setUrls] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${BACKEND_URL}/authenticate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        console.log(err);
        window.location.href = "/login";
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUrls = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
          if (!token) throw new Error("No token found");

          const response = await axios.get(`${BACKEND_URL}/loggedin/${user._id}/urls`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const transformedUrls = response.data.urls.newLink.map((newLink, index) => ({
              shortUrl: newLink,
              longUrl: response.data.urls.oldLink[index],
              qrCode: "-", // Assuming you don't have QR code data in the response
              clicks: (user.subscription === "Free" || user.subscription === null || new Date(user.endDateOfSubscription) < new Date()) ? "-" : user.Viewer[index] || 0,
            }));
            setUrls(transformedUrls);
          } else {
            throw new Error("Failed to fetch URLs");
          }
        } catch (error) {
          console.error("Error fetching URLs:", error);
        }
      };

      fetchUrls();
    }
  }, [user]);

  const subscription = user && user.subscription;

  const dashboardColumns = useMemo(
    () => [
      {
        Header: "Short Link",
        accessor: "shortUrl",
        Cell: ({ cell: { value } }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: "Long Link",
        accessor: "longUrl",
        Cell: ({ cell: { value } }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: "QR Code",
        accessor: "qrCode",
        Cell: ({ cell: { value } }) => ("-"),
      },
      {
        Header: "Clicks",
        accessor: "clicks",
        Cell: ({ cell: { value } }) => value,
      },
    ],
    []
  );

  const data = useMemo(() => Array.isArray(urls) ? urls : [], [urls]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns: dashboardColumns, data });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert(text + " copied to clipboard");
  }

  return (
    <table {...getTableProps()} className="table" style={{ width: "80%", alignItems: "center" }}>
      <thead
        style={{
          backgroundColor: "#181E29",
          height: "40px",
          border: "1px solid #181E29",
          borderRadius: "15px 15px 0 0",
        }}
      >
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} style={{ border: "1px solid #353C4A" }}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      margin: "auto",
                      padding: "auto",
                      textAlign: "center",
                    }}
                  >
                    {cell.column.id === "shortUrl" && (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {cell.render("Cell")}
                        <button
                          onClick={() => copyToClipboard(cell.value)}
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#181E29",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <IoCopy />
                        </button>
                      </div>
                    )}
                    {cell.column.id === "longUrl" && (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {cell.render("Cell")}
                        <button
                          onClick={() => copyToClipboard(cell.value)}
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#181E29",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <IoCopy />
                        </button>
                      </div>
                    )}
                    {cell.column.id !== "shortUrl" && cell.column.id !== "longUrl" && cell.render("Cell")}
                    {isMobile && (
                      <button
                        style={{
                          marginLeft: "120px",
                          backgroundColor: "#0B101B",
                          marginRight: "-180px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <IoIosArrowDropdown />
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Dashboard_Loginned;

import React, { useState } from "react";
import { useTable } from "react-table";
import { IoCopy } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { IoIosArrowDropdown } from "react-icons/io";

// ...

function Dashboard() {
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });

  const dashboardColumns = React.useMemo(
    () => [
      {
        Header: "Short Link",
        accessor: "shortLink",
      },
      {
        Header: "Long Link",
        accessor: "longLink"
      },
      ...(!isMobile
        ? [
            {
              Header: "QR Code",
              accessor: "qrCode",
            },
            {
              Header: "Clicks",
              accessor: "clicks",
            },
            {
              Header: "",
              accessor: "del",
            },
          ]
        : []),
    ],
    [isMobile]
  );
  const data = React.useMemo(
    () => [
      {
        shortLink: "bit.ly/123",
        originalLink: "https://example.com",
        qrCode: "QR Code 1",
        clicks: 100,
        status: "Inactive",
        date: "2022-01-01",
      },
      {
        shortLink: "bit.ly/123",
        originalLink: "https://example.com",
        qrCode: "QR Code 1",
        clicks: 100,
        status: "Active",
        date: "2022-01-01",
      },
      {
        shortLink: "bit.ly/123",
        originalLink: "https://example.com",
        qrCode: "QR Code 1",
        clicks: 100,
        status: "Active",
        date: "2022-01-01",
      },
      {
        shortLink: "bit.ly/123",
        originalLink: "https://example.com",
        qrCode: "QR Code 1",
        clicks: 100,
        status: "Active",
        date: "2022-01-01",
      },
      {
        shortLink: "bit.ly/123",
        originalLink: "https://example.com",
        qrCode: "QR Code 1",
        clicks: 100,
        status: "Active",
        date: "2022-01-01",
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: dashboardColumns, data });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <table
      {...getTableProps()}
      className="table"
      style={{ width: "80%", alignItems: "center" }}
    >
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
                    {cell.column.id === "status" ? (
                      cell.value === "Active" ? (
                        <span style={{ color: "green" }}>
                          <FaCheckCircle /> {cell.render("Cell")}
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>
                          <FaTimesCircle /> {cell.render("Cell")}
                        </span>
                      )
                    ) : (
                      cell.render("Cell")
                    )}
                    {cell.column.id === "shortLink" && (
                      <button
                        onClick={() => copyToClipboard(cell.value)}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "#181E29",
                        }}
                      >
                        <IoCopy />
                      </button>
                    )}
                    {isMobile && (
                      <button
                        style={{
                          marginLeft: "120px",
                          backgroundColor: "#0B101B",
                          marginRight: "-180px",
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
}

export default Dashboard;

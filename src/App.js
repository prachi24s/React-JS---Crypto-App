import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Dropdown, Input, Modal, Pagination, Table } from "antd";
import "./App.css";
import Logo from "./assets/logo.webp";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  FilterOutlined,
} from "@ant-design/icons";

function LogoComponent() {
  return (
    <div className="logo-header">
      <img src={Logo} alt="Crypto App" width="40" height="40" />
      <h2 style={{ marginTop: 12 }}>Crypto App</h2>
    </div>
  );
}

// function useSomething() {}

// useState, useEffect

//.toLowercase()

function App() {
  //State
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [dataFields, setDataFields] = useState([]);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(1);
  const [sortBy, setSortBy] = useState("");

  const getCryptoCurrencyData = useCallback(async () => {
    setError("");
    setIsFetching(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sortBy}_desc&per_page=10&page=${current}`
      );
      const data = await response.json();
      console.log("respo: ", response);
      setIsFetching(false);
      if (data.error) {
        return setError(data.error);
      }
      console.log("data: ", data);
      setDataFields(data);
    } catch (e) {
      setIsFetching(false);
      setError(e.message);
    }
  }, [current, sortBy]);

  useEffect(() => {
    getCryptoCurrencyData();
  }, [getCryptoCurrencyData]);

  const columns = [
    {
      title: "#",
      dataIndex: "image",
      key: "image",
      render: (image, row) => {
        return <img src={image} alt={row.name} width={32} height={32} />;
      },
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Pet Name",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => (
        <p style={{ textTransform: "uppercase" }}>{symbol}</p>
      ),
    },
    {
      title: "Price",
      dataIndex: "current_price",
      key: "price",
      render: (price) => <div>${price}</div>,
    },
    {
      title: "Profit & Loss rate",
      dataIndex: "price_change_percentage_24h",
      key: "profitAndLossRate",
      render: (profitAndLossRate) => {
        return (
          <div style={{ color: profitAndLossRate < 0 ? "red" : "green" }}>
            {profitAndLossRate < 0 ? (
              <ArrowDownOutlined style={{ fontSize: 12 }} />
            ) : profitAndLossRate > 0 ? (
              <ArrowUpOutlined style={{ fontSize: 12 }} />
            ) : null}{" "}
            {`${profitAndLossRate.toFixed(1)}`.replace("-", "")}%
          </div>
        );
      },
    },
    {
      title: "Market Cap",
      dataIndex: "market_cap",
      key: "market_cap",
      render: (investedValue) => <div>${investedValue}</div>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, row) => {
        return (
          <Button type="text" onClick={() => setDetails(row)}>
            <EyeOutlined />
          </Button>
        );
      },
    },
  ];

  const menu_items = [
    {
      key: "1",
      label: "Sort By",
      children: [
        {
          key: "current_price",
          label: (
            <Button
              style={{ width: "100%" }}
              type="text"
              onClick={() => setSortBy("current_price")}
            >
              Price
            </Button>
          ),
        },
        {
          key: "market_cap",
          label: (
            <Button
              type="text"
              style={{ width: "100%" }}
              onClick={() => setSortBy("market_cap")}
            >
              Market Cap
            </Button>
          ),
        },
      ],
    },
  ];

  // useCallback, useMemo

  const filteredList = useMemo(() => {
    return dataFields.filter((field) => {
      if (field.name.toLowerCase().includes(search.toLowerCase())) return true;
      if (field.symbol.toLowerCase().includes(search.toLowerCase()))
        return true;
      return false;
    });
  }, [search, dataFields]);

  return (
    <div className="App">
      <div style={{ maxWidth: "70%", width: "100%" }}>
        <header>
          <LogoComponent />
          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", gap: 12, width: "50%" }}>
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
              />
              <Button type="primary">Search</Button>
            </div>
            <Dropdown menu={{ items: menu_items }}>
              <Button>
                <FilterOutlined />
                Filters
              </Button>
            </Dropdown>
          </div>
        </header>
        <div style={{ marginTop: 48 }}>
          <Table
            columns={columns}
            dataSource={filteredList}
            rowKey={"id"}
            footer={() =>
              error.length ? (
                <Alert banner type="error" message={error} />
              ) : (
                <Pagination
                  showSizeChanger={false}
                  current={current}
                  total={100}
                  pageSize={10}
                  onChange={(pageNo) => setCurrent(pageNo)}
                />
              )
            }
            loading={isFetching}
          />
        </div>
      </div>
      {details?.id ? (
        <Modal
          title="Crypto Details"
          open
          onOk={() => setDetails(null)}
          onCancel={() => setDetails(null)}
        >
          <p>
            Name: <span>{details.name}</span>
          </p>
          <p>
            Pet Name: <span>{details.petName}</span>
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

export default App;

// {
//   "key": "value"
// }
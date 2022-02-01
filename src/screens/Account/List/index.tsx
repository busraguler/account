import React, { useEffect, useState } from "react";
import { Input, Table, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { appStore, useAppStoreState } from "../../../stores/appStore";
import "antd/dist/antd.css";
import deleteIcon from "../../../assets/images/delete.png";
import editIcon from "../../../assets/images/edit.png";
import arrowLeftIcon from "../../../assets/images/arrow-left.png";
import arrowRightIcon from "../../../assets/images/arrow-right.png";

interface TableColumn {
  title?: any;
  dataIndex?: string;
  key?: string;
  render?: any;
}

export const List = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const appState = useAppStoreState();
  const navigate = useNavigate();

  var swapColumn = function (
    arr: TableColumn[],
    indexA: number,
    indexB: number
  ) {
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
    setColumns(arr);
    return arr;
  };

  const columnChange = (text: string, dataIndex: string) => {
    if (text === "left") {
      let newColumns: TableColumn[] = [];
      // let column = columns.find((x) => x.dataIndex === dataIndex);
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].dataIndex === dataIndex && i !== 0) {
          newColumns = swapColumn(columns, i, i - 1);
          console.log("newColumns", newColumns);
        }
      }
    }
  };

  const columnTitle = (text: string, dataIndex: string) => {
    return (
      <span>
        <div className="table-title">
          {" "}
          <img
            onClick={() => columnChange("left", dataIndex)}
            src={arrowLeftIcon}
            alt="arrowLeftIcon"
            width={14}
            height={14}
            style={{ marginRight: "20px" }}
          />
          {text}
          <img
            src={arrowRightIcon}
            alt="arrowRightIcon"
            width={14}
            height={14}
            style={{ marginLeft: "20px" }}
          />
        </div>
      </span>
    );
  };
  const [columns, setColumns] = useState<TableColumn[]>([
    {
      title: columnTitle("Vkn / Tckn", "tckn"),
      dataIndex: "tckn",
    },
    {
      title: columnTitle("Unvan / Ad Soyad", "titleNameSurname"),
      dataIndex: "titleNameSurname",
    },
    {
      title: columnTitle("Adres", "address"),
      dataIndex: "address",
    },
    {
      title: columnTitle("İl", "city"),
      dataIndex: "city",
    },
    {
      title: "İşlem",
      key: "action",
      render: (text: string, record: any) => {
        return (
          <Space size="middle">
            <a onClick={() => handleEditAccount(record)}>
              {" "}
              <img
                id="editIcon"
                src={editIcon}
                alt="editIcon"
                width={18}
                height={18}
              />
            </a>
            <a onClick={() => handleDeleteAccount(record)}>
              <img
                id="deleteIcon"
                src={deleteIcon}
                alt="deleteIcon"
                width={18}
                height={18}
              />
            </a>
          </Space>
        );
      },
    },
  ]);

  useEffect(() => {
    console.log("dsfsdfsdf", columns);
  }, [columns]);

  useEffect(() => {
    setIsLoading(true);

    appState.accounts.forEach(function (item: any) {
      let title = item.title !== undefined ? item.title : "";
      let name = item.name !== undefined ? item.name : "";
      let surname = item.surname !== undefined ? item.surname : "";
      item.titleNameSurname = title + " " + name + " " + surname;
    });

    setTimeout(() => {
      setTableData(appState.accounts);
      setIsLoading(false);
    }, 500);
  }, [appState.accounts]);

  const handleDeleteAccount = (account: any) => {
    appStore.dispatch(
      "accounts",
      appState.accounts.filter((x: any) => x.tckn !== account.tckn)
    );
  };

  const handleEditAccount = (account: any) => {
    navigate(`/new-account`, {
      state: appState.accounts.filter((x: any) => x.tckn === account.tckn),
    });
  };

  useEffect(() => {
    let searchData = appState.accounts.filter((x: any) => {
      if (
        x.tckn.toLowerCase().includes(searchTxt.toLowerCase()) ||
        x.titleNameSurname.toLowerCase().includes(searchTxt.toLowerCase())
      ) {
        return x;
      }
    });
    const timeoutId = setTimeout(() => {
      searchTxt.length > 0 && setIsLoading(true);
      setTimeout(() => {
        setTableData(searchData);
        setIsLoading(false);
      }, 1000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchTxt]);

  return (
    <div className="main-container">
      <div className="container">
        <div className="search-and-added">
          <Input
            placeholder="Ara"
            style={{
              width: "250px",
              height: "36px",
              border: "1px solid #e5e5e5",
            }}
            defaultValue={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
          />
          <Button
            className="custom-button"
            type="primary"
            onClick={() => navigate(`/new-account`)}
          >
            Hesap Ekle
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={[...tableData]}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

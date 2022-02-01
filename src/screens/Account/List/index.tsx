import React, { useEffect, useState } from "react";
import { Input, Table, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppStoreState } from "../../../stores/appStore";
import "antd/dist/antd.css";
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
  const [columns, setColumns] = useState<TableColumn[]>();
  const appState = useAppStoreState();
  const navigate = useNavigate();

  useEffect(() => {
    setColumns([
      {
        title: columnTitle("Vkn / Tckn", "tckn"),
        dataIndex: "tckn",
        key: "0",
      },
      {
        title: columnTitle("Unvan / Ad Soyad", "titleNameSurname"),
        dataIndex: "titleNameSurname",
        key: "1",
      },
      {
        title: columnTitle("Adres", "address"),
        dataIndex: "address",
        key: "2",
      },
      {
        title: columnTitle("İl", "city"),
        dataIndex: "city",
        key: "3",
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
            </Space>
          );
        },
      },
    ]);
  }, []);

  const columnTitle = (text: string, dataIndex: string) => {
    return (
      <span>
        <div className="table-title">
          <img
            id={"leftSwap-" + dataIndex}
            src={arrowLeftIcon}
            alt="arrowLeftIcon"
            width={14}
            height={14}
            style={{ marginRight: "20px", cursor: "pointer" }}
          />
          {text}
          <img
            id={"rightSwap-" + dataIndex}
            src={arrowRightIcon}
            alt="arrowRightIcon"
            width={14}
            height={14}
            style={{ marginLeft: "20px", cursor: "pointer" }}
          />
        </div>
      </span>
    );
  };

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

  const handleEditAccount = (account: any) => {
    navigate(`/new-account`, {
      state: appState.accounts.filter((x: any) => x.tckn === account.tckn),
    });
  };

  var swapColumn = function (
    arr: TableColumn[],
    indexA: number,
    indexB: number
  ) {
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
    arr = arr.map((item, key) => {
      item.key = "key" + key;
      return item;
    });
    setColumns(arr);
  };

  const changeColumn = (direction: number, id: string) => {
    if (columns !== undefined) {
      let column = columns.find((x) => x.dataIndex === id.split("-")[1]);
      if (column) {
        let i = columns.indexOf(column);
        if (direction === 0 && i !== 0) {
          swapColumn(columns, i, i - 1);
        }
        if (direction === 1 && i !== columns.length - 2) {
          swapColumn(columns, i, i + 1);
        }
      }
    }
  };

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
          onHeaderRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                const target = event.target as Element;
                if (target.id.split("-")[0] === "leftSwap") {
                  changeColumn(0, target.id);
                }
                if (target.id.split("-")[0] === "rightSwap") {
                  changeColumn(1, target.id);
                }
              },
            };
          }}
        />
      </div>
    </div>
  );
};

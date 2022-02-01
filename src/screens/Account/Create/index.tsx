import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Modal } from "antd";
import "antd/dist/antd.css";
import { useNavigate, useLocation } from "react-router-dom";
import { cityAndDistrict } from "../../../utils/il-ilce";
import { appStore, useAppStoreState } from "../../../stores/appStore";
import { formatNumber } from "../../../utils/utils";
import accountImage from "../../../assets/images/accounting.png";
import backIcon from "../../../assets/images/back.png";
import deleteIcon from "../../../assets/images/delete.png";

const { Option } = Select;

export const Create = () => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tckn, setTckn] = useState("");
  const [nameSurnameVisible, setNameSurnameVisible] = useState(true);
  const [titleVisible, setTitleVisible] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [district, setDistrict] = useState([]);
  const navigate = useNavigate();
  const appState = useAppStoreState();
  const location: any = useLocation();

  const account = location.state && location.state[0];

  useEffect(() => {
    form.resetFields();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      tckn: account !== null ? account.tckn : "",
      name: account !== null ? account.name : "",
      surname: account !== null ? account.surname : "",
      title: account !== null ? account.title : "",
      address: account !== null ? account.address : "",
      city: account !== null ? account.city : "",
      district: account !== null ? account.district : "",
    });

    setTckn(account !== null ? account.tckn : "");
  }, []);

  useEffect(() => {
    if (account !== null) {
      let district: any = cityAndDistrict.filter((item) => {
        return item.il_adi === account.city;
      });
      setDistrict(district[0].ilceler);
    }
  }, [account]);

  useEffect(() => {
    setNameSurnameVisible(true);
    setTitleVisible(true);
    if (tckn.length === 10) {
      setNameSurnameVisible(false);
    } else if (tckn.length === 11) {
      setNameSurnameVisible(true);
      setTitleVisible(false);
    }
  }, [tckn]);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
    wrapperButtonCol: {
      span: 24,
    },
  };

  const onChangeCity = (value: string) => {
    if (value) {
      let district: any = cityAndDistrict.filter((item) => {
        return item.il_adi === value;
      });
      setDistrict(district[0].ilceler);
      form.setFieldsValue({
        district: "",
      });
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
    setLoading(true);
    let newAccounts;
    if (account !== null) {
      newAccounts = appState.accounts.map((x: any) => {
        if (x.tckn === account.tckn) {
          x.tckn = values.tckn;
          x.title = values.title;
          x.name = values.name;
          x.surname = values.surname;
          x.address = values.address;
          x.city = values.city;
          x.district = values.district;
        }
        return x;
      });
    } else {
      newAccounts = appState.accounts;
      newAccounts.push({
        tckn: values.tckn,
        title: values.title,
        name: values.name,
        surname: values.surname,
        address: values.address,
        city: values.city,
        district: values.district,
      });
    }
    appStore.dispatch("accounts", newAccounts);

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (account !== null) {
      setConfirmLoading(true);
      let tckn = form.getFieldValue("tckn");
      appStore.dispatch(
        "accounts",
        appState.accounts.filter((x: any) => x.tckn !== tckn)
      );
      setTimeout(() => {
        setConfirmLoading(false);
        setModalVisible(false);
        navigate("/");
      }, 1000);
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <div className="search-and-added">
          <div
            onClick={() => {
              navigate("/");
            }}
          >
            <img id="back" src={backIcon} alt="back" width={18} height={18} />
          </div>
          {account !== null && (
            <>
              <Button
                className="delete-button"
                type="primary"
                onClick={() => setModalVisible(true)}
              >
                Sil
              </Button>
              <Modal
                title="Cari Hesap Sil"
                visible={modalVisible}
                onOk={() => handleDeleteAccount()}
                confirmLoading={confirmLoading}
                onCancel={() => setModalVisible(false)}
              >
                <p>Cari hesap silinecektir, devam etmek istiyor musunuz?</p>
              </Modal>
            </>
          )}
        </div>
        <div className="account-card">
          <div className="left-column">
            <div className="title">Hesap Ekleme</div>
            <img
              id="account"
              src={accountImage}
              alt="account"
              width={300}
              height={300}
            />
          </div>
          <div className="form">
            <Form
              {...layout}
              form={form}
              initialValues={account}
              onFinish={onFinish}
            >
              <Form.Item
                name={"tckn"}
                label="Vkn / Tckn"
                rules={[
                  {
                    required: true,
                    message: "Vkn / Tckn gereklidir.",
                  },
                  {
                    max: 11,
                    min: 10,
                    message: "Vkn / Tckn 10-11 hane olmalıdır.",
                  },
                ]}
              >
                <Input onChange={(e) => setTckn(e.target.value)} />
              </Form.Item>
              {nameSurnameVisible && (
                <>
                  <Form.Item
                    name={"name"}
                    label="Ad"
                    rules={[
                      {
                        required: true,
                        message: "Ad gereklidir",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={"surname"}
                    label="Soyad"
                    rules={[
                      {
                        required: true,
                        message: "Soyad gereklidir.",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
              {titleVisible && (
                <Form.Item
                  name={"title"}
                  label="Unvan"
                  rules={[
                    {
                      required: true,
                      message: "Ünvan gereklidir.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              )}

              <Form.Item
                name={"address"}
                label="Adres"
                rules={[
                  {
                    required: true,
                    message: "Adres gereklidir.",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name={"city"}
                label="İl"
                rules={[
                  {
                    required: true,
                    message: "İl gereklidir.",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="İl seçin"
                  optionFilterProp="children"
                  onChange={onChangeCity}
                  filterOption={(input, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  <Option value="0">İl Seçin</Option>
                  {cityAndDistrict &&
                    cityAndDistrict.length > 0 &&
                    cityAndDistrict.map((item, key) => {
                      return (
                        <Option key={item.plaka_kodu} value={item.il_adi}>
                          {item.il_adi}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
              {district && district.length > 0 && (
                <Form.Item
                  name={"district"}
                  label="İlçe"
                  rules={[
                    {
                      required: true,
                      message: "İlçe gereklidir.",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="İlçe seçin"
                    optionFilterProp="children"
                  >
                    <Option value="">İlçe Seçin</Option>
                    {district.map((item: any, key) => {
                      return (
                        <Option key={item.ilce_adi} value={item.ilce_adi}>
                          {item.ilce_adi}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                wrapperCol={{ ...layout.wrapperButtonCol, offset: 20 }}
              >
                <Button
                  className="custom-button"
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Ekle
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

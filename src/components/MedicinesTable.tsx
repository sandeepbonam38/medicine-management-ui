import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { Medicine } from "../models/Medicine";
import { getMedicines } from "../services/medicineService";

const MedicinesTable: React.FC = () => {

  //States
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

 //Table Columns
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  //Data Fetching
  const fetchDate = async () =>{
      try {     
        setLoading(true);
        const result = await getMedicines();
        setData(result);
      }catch (error) {
        message.error("Failed to load medicines");
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchDate();
  }, []);

  

  return (
    <div style={{ padding: 20 }}>
      <h2>Medicines List</h2>

      <Table columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default MedicinesTable;
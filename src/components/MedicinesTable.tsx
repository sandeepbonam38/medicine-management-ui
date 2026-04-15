import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Spin, Tag, Input, Select  } from "antd";
import { Medicine } from "../models/Medicine";
import { getMedicines } from "../services/medicineService";
import '../Styles/Medicines.css'


const { Option } = Select;

const MedicinesTable: React.FC = () => {

  //States
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

//filtering states
  const [searchText, setSearchText] = useState("");

  const [expiryFilter, setExpiryFilter] = useState<string | undefined>(undefined);

  const [quantityFilter, setQuantityFilter] = useState<string | undefined>(undefined);


  const { Option } = Select;
 const sampleJson = [
  {
    "id": 1,
    "fullName": "Paracetamol 500mg",
    "notes": "Used for fever and mild pain relief",
    "expiryDate": "2026-12-31",
    "quantity": 120,
    "price": 50,
    "brand": "Cipla"
  },
  {
    "id": 2,
    "fullName": "Ibuprofen 200mg",
    "notes": "Anti-inflammatory pain reliever",
    "expiryDate": "2025-08-15",
    "quantity": 60,
    "price": 80,
    "brand": "Sun Pharma"
  },
  {
    "id": 3,
    "fullName": "Amoxicillin 250mg",
    "notes": "Antibiotic for bacterial infections",
    "expiryDate": "2025-05-10",
    "quantity": 30,
    "price": 120,
    "brand": "Dr Reddy's"
  },
  {
    "id": 4,
    "fullName": "Cough Syrup",
    "notes": "Relief from dry cough",
    "expiryDate": "2026-01-20",
    "quantity": 45,
    "price": 75,
    "brand": "Benadryl"
  }
]

  //Data Fetching
  const fetchMedicines = async () =>{
      try {     
        setLoading(true);
        const result = await getMedicines();
        // setData(result);
        setData(sampleJson);
      }catch (error) {
        message.error("Failed to load medicines");
      } finally {
        setLoading(false);
      }
  }

  //Page Load
  useEffect(() => {
    fetchMedicines();
  }, []);


  //filtering logic
  const filteredData = data.filter((item) => {
      const today = new Date();
      const expiry = new Date(item.expiryDate);

      const matchesSearch =
        (item.fullName || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (item.brand || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (item.notes || "").toLowerCase().includes(searchText.toLowerCase());

      // 📅 EXPIRY FILTER
      let expiryMatch = true;

      if (expiryFilter === "10days") {
        const future = new Date();
        future.setDate(today.getDate() + 10);
        expiryMatch = expiry >= today && expiry <= future;
      }

      if (expiryFilter === "1month") {
        const future = new Date();
        future.setMonth(today.getMonth() + 1);
        expiryMatch = expiry >= today && expiry <= future;
      }

      if (expiryFilter === "expired") {
        expiryMatch = expiry < today;
      }

      // 📦 QUANTITY FILTER
      let quantityMatch = true;

      if (quantityFilter === "low") {
        quantityMatch = item.quantity < 20;
      }

      if (quantityFilter === "medium") {
        quantityMatch = item.quantity >= 20 && item.quantity <= 50;
      }

      if (quantityFilter === "high") {
        quantityMatch = item.quantity > 50;
      }

      return matchesSearch && expiryMatch && quantityMatch;
    });

  //grid colur logic
  const getGridStyle = (item: Medicine) => {
  const today = new Date();
  const expiry = new Date(item.expiryDate);

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 30) {
      return {
        backgroundColor: "#fff1f0",
        border: "1px solid #ff4d4f",
        borderRadius: "10px",
        padding: "8px"
      };
    }

    if (item.quantity < 10) {
      return {
        backgroundColor: "#fffbe6",
        border: "1px solid #faad14",
        borderRadius: "10px",
        padding: "8px"
      };
    }

    return {
      padding: "8px"
    };
  };


  return (
  <div className="medicine-container">
  <h2 className="medicine-title">💊 Medicines Grid</h2>
     

     <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
  
            <Input
              placeholder="Search medicines..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />

            <Select
              placeholder="Filter by ExpiryDate"
              value={expiryFilter}
              onChange={(value) => setExpiryFilter(value)}
              allowClear
              style={{ width: 200 }}
            >
              <Option value="10days">Next 10 Days</Option>
              <Option value="1month">Next 1 Month</Option>
              <Option value="expired">Expired</Option>
            </Select>

            <Select
            placeholder="Filter by Quantity"
              value={quantityFilter}
              onChange={(value) => setQuantityFilter(value)}
              allowClear
              style={{ width: 200 }}
            >
              <Option value="low">Low (&lt;20)</Option>
              <Option value="medium">20–50</Option>
              <Option value="high">&gt;50</Option>
            </Select>

          </div>

      {loading ? (
        <div className="loader">
          <Spin size="large" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state">
          <h3>🚫 No Medicines Found</h3>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredData.map((item) => (
            <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            key={item.id}
            style={getGridStyle(item)}
          >
              <Card
                title={item.fullName}
                bordered={false}
                hoverable
                className="medicine-card"
              >
                <p><b>📝 Notes:</b> {item.notes}</p>

                <p>
                  <b>📅 Expiry:</b>
                  <Tag color="red">{item.expiryDate}</Tag>
                </p>

                <p>
                  <b>📦 Quantity:</b>
                  <Tag color="blue">{item.quantity}</Tag>
                </p>

                <p>
                  <b>💰 Price:</b>
                  <span className="price"> ₹{item.price}</span>
                </p>

                <p>
                  <b>🏷 Brand:</b>
                  <Tag color="purple">{item.brand}</Tag>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MedicinesTable;
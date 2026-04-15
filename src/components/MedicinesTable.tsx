import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Spin } from "antd";
import { Medicine } from "../models/Medicine";
import { getMedicines } from "../services/medicineService";

const MedicinesTable: React.FC = () => {

  //States
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

 

  //Data Fetching
  const fetchMedicines = async () =>{
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

  //Page Load
  useEffect(() => {
    fetchMedicines();
  }, []);


  return (
    <div style={{ padding: 20 }}>
      <h2>💊 Medicines Grid</h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <h3>🚫 No Medicines Found</h3>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {data.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card title={item.fullName} bordered>
                <p><b>Notes:</b> {item.notes}</p>
                <p><b>Expiry Date:</b> {item.expiryDate}</p>
                <p><b>Quantity:</b> {item.quantity}</p>
                <p><b>Price:</b> ₹{item.price}</p>
                <p><b>Brand:</b> {item.brand}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MedicinesTable;
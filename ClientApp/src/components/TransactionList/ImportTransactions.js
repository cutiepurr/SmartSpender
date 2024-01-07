import React, { useState } from "react";
import { Input } from "reactstrap";
import Papa from "papaparse";

const ImportTransactions = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [columnMap, setColumnMap] = useState({
    description: "",
    amount: "",
    category: "",
    timestamp: "",
  });


  const parseFile = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setModalOpen(true);
      },
    });
  };

  return (
    <div>
      <Input type="file" accept=".csv" onChange={parseFile} />
    </div>
  );
};

export default ImportTransactions;

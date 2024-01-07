import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Papa from "papaparse";

const ImportTransactions = (props) => {
  const [data, setData] = useState([{}]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileColumns, setFileColumns] = useState([]);

  useEffect(() => {
    setFileColumns(Object.keys(data[0]));
  }, [data]);

  useEffect(() => {
    // Reset data
    if (!modalOpen) {
      setData([{}]);
      setFileColumns([]);
    }
  }, [modalOpen]);

  const parseFile = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <div {...props}>
      <Button onClick={toggleModal} outline><i className="fa-solid fa-file-import"></i> Import</Button>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Import Transactions</ModalHeader>
        <ModalBody>
          <Input type="file" accept=".csv" onChange={parseFile} />
          <p className="text-muted">Accept .csv</p>
          { fileColumns.length==0 ? null : <MapColumn columns={fileColumns} />}
        </ModalBody>
      </Modal>
    </div>
  );
};

const MapColumn = ({ columns }) => {
  const destinationColumns = ["Timestamp", "Description", "Amount", "Category"];

  return (
    <div className="mt-3">
      <h3>Map columns</h3>
      {destinationColumns.map((destinationColumn, index) => (
        <Row key={index} className="my-3">
          <Col md={3}>{destinationColumn}</Col>
          <Col md={9}>
            <Input type="select">
              {columns.map((column, index) => (
                <option value={index}>{column}</option>
              ))}
            </Input>
          </Col>
        </Row>
      ))}
      <Button>Save</Button>
    </div>
  );
};

export default ImportTransactions;

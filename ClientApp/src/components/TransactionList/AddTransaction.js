import React, { useEffect, useState } from "react";
import { Form, Input } from "reactstrap";

const AddTransaction = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`/api/Category`)
    .then(response => response.json())
    .then(data => {
        setCategories(data);
        console.log(data);
    })
  }, []);

  return (
    <Form>
        <Input name="description" placeholder="Description" />
    </Form>
  );
};

export default AddTransaction;

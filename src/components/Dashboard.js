import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container,
  Table,
} from "reactstrap";
import classnames from "classnames";
import { addTransaction, getTransactions } from "../utils/networkHandler";
import { useHistory } from "react-router-dom";

const Dashboard = ({ userID }) => {
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState({
    oneWeekRecord: { transactions: [] },
    oneMonthRecord: { transactions: [] },
    oneYearRecord: { transactions: [] },
  });

  const [total, setTotal] = useState({
    oneWeek: { income: "", expense: "" },
    oneMonth: { income: "", expense: "" },
    oneYear: { income: "", expense: "" },
  });

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [selectedIncomeChip, setSelectedIncomeChip] = useState("");

  const [incomeData, setIncomeData] = useState({
    amount: "",
    description: "",
    category: "",
  });

  const [selectedExpenseChip, setSelectedExpenseChip] = useState("");

  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
    division: "",
  });

  const incomeCategoryChips = [
    "Allowance",
    "Salary",
    "Petty Cash",
    "Bonus",
    "Others",
  ];

  const expenseCategoryChips = [
    "Fuel",
    "Food",
    "Shopping",
    "Loan",
    "Medical",
    "Movie",
    "Others",
  ];

  const divisions = ["Personal", "Office"];

  const fetchTransactions = async () => {
    let res = await getTransactions(userID);
    setLoading(false);
    if (res.success) {
      setTransactionData(res);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    calculateCardValues();
  }, [transactionData]);

  const calculateCardValues = () => {
    let oneWeek = { income: 0, expense: 0 };
    let oneMonth = { income: 0, expense: 0 };
    let oneYear = { income: 0, expense: 0 };
    transactionData.oneWeekRecord.transactions.forEach((item) => {
      if (item.type === "Income") {
        oneWeek.income = oneWeek.income + item.amount;
      } else {
        oneWeek.expense = oneWeek.expense + item.amount;
      }
    });
    transactionData.oneMonthRecord.transactions.forEach((item) => {
      if (item.type === "Income") {
        oneMonth.income = oneMonth.income + item.amount;
      } else {
        oneMonth.expense = oneMonth.expense + item.amount;
      }
    });
    transactionData.oneYearRecord.transactions.forEach((item) => {
      if (item.type === "Income") {
        oneYear.income = oneYear.income + item.amount;
      } else {
        oneYear.expense = oneYear.expense + item.amount;
      }
    });
    setTotal({ oneWeek, oneMonth, oneYear });
  };

  const addIncome = async () => {
    if (incomeData.amount.length > 0) {
      if (incomeData.category.length > 0) {
        if (incomeData.description.length > 0) {
          toggle();
          let res = await addTransaction({
            ...incomeData,
            userId: userID,
            type: "Income",
            division: "",
          });
          if (res.success) {
            alert(res.message);
            fetchTransactions();
            console.log(res);
          } else {
            alert(res.message);
            console.log("err", res);
          }
        } else {
          alert("Enter description");
        }
      } else {
        alert("Select category");
      }
    } else {
      alert("Enter amount");
    }
  };

  const addExpense = async () => {
    if (expenseData.amount.length > 0) {
      if (expenseData.category.length > 0) {
        if (expenseData.description.length > 0) {
          if (expenseData.division.length > 0) {
            toggle();
            let res = await addTransaction({
              type: "expense",
              userId: userID,
              ...expenseData,
            });
            if (res.success) {
              alert(res.message);
              fetchTransactions();
            } else {
              console.log("err", res);
            }
          } else {
            alert("Choose division");
          }
        } else {
          alert("Enter description");
        }
      } else {
        alert("Select category");
      }
    } else {
      alert("Enter amount");
    }
  };

  return (
    <>
      {!loading && (
        <Container>
          <Row>
            <Col xs={6} md={4} className="p-1">
              <div className="report-card">
                <Row>
                  <Col xs={12} className="text-center mb-2">
                    <h3>This Week</h3>
                  </Col>
                  <Col xs={12} md={6} className="text-center">
                    <h4 style={{ color: "green" }}>{total.oneWeek.income}</h4>
                  </Col>
                  <Col xs={12} md={6} className="text-center">
                    <h4 style={{ color: "red" }}>{total.oneWeek.expense}</h4>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={6} md={4} className="p-1">
              <div className="report-card">
                <Row>
                  <Col xs={12} className="text-center mb-2">
                    <h3>This Month</h3>
                  </Col>
                  <Col xs={12} md={6} className="text-center">
                    <h4 style={{ color: "green" }}>{total.oneMonth.income}</h4>
                  </Col>
                  <Col xs={12} md={6} className="text-center">
                    <h4 style={{ color: "red" }}>{total.oneMonth.expense}</h4>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={12} md={4} className="p-1">
              <div className="report-card">
                <Row>
                  <Col xs={12} className="text-center mb-2">
                    <h3>This Year</h3>
                  </Col>
                  <Col xs={12} md={6} className="text-center">
                    <h4 style={{ color: "green" }}>{total.oneMonth.income}</h4>
                  </Col>
                  <Col xs={12} md={6} className="text-center">
                    <h4 style={{ color: "red" }}>{total.oneMonth.expense}</h4>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="p-1">
              <div className="title">
                <h4>Latest Transactions</h4>
                <Button color="primary" size="sm" onClick={toggle}>
                  Add
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="p-1">
              <Table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Division</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.oneWeekRecord.transactions.map((item) => {
                    return (
                      <tr key={item._id}>
                        <td>{item.type}</td>
                        <td>{item.amount}</td>
                        <td>{item.division}</td>
                        <td>{item.category}</td>
                        <td>{item.description}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          {/* Modal */}
          <Modal isOpen={modal} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>Add Transaction</ModalHeader>
            <ModalBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1");
                    }}
                  >
                    Income
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Expense
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <h4 className="mt-2">Income</h4>
                      <Input
                        className="mb-2"
                        type="text"
                        placeholder="Enter amount"
                        value={incomeData.amount}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            setIncomeData({
                              ...incomeData,
                              amount: e.target.value,
                            });
                          }
                        }}
                      />
                      <Input
                        className="mb-2"
                        type="text"
                        placeholder="Enter description"
                        value={incomeData.description}
                        onChange={(e) =>
                          setIncomeData({
                            ...incomeData,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="categories-wrapper mb-2">
                        <p>Select category</p>
                        {incomeCategoryChips.map((item) => (
                          <div
                            key={item}
                            className={
                              selectedIncomeChip === item
                                ? "categories-chip selected-chip"
                                : "categories-chip"
                            }
                            onClick={() => {
                              setSelectedIncomeChip(item);
                              setIncomeData({ ...incomeData, category: item });
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <Button color="primary" onClick={addIncome}>
                        Add Income
                      </Button>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <h4 className="mt-2">Expense</h4>
                      <Input
                        className="mb-2"
                        type="text"
                        placeholder="Enter amount"
                        value={expenseData.amount}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            setExpenseData({
                              ...expenseData,
                              amount: e.target.value,
                            });
                          }
                        }}
                      />
                      <Input
                        className="mb-2"
                        type="text"
                        placeholder="Enter description"
                        onChange={(e) =>
                          setExpenseData({
                            ...expenseData,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="categories-wrapper mb-2">
                        <p>Select category</p>
                        {expenseCategoryChips.map((item) => (
                          <div
                            key={item}
                            className={
                              selectedExpenseChip === item
                                ? "categories-chip selected-chip"
                                : "categories-chip"
                            }
                            onClick={() => {
                              setSelectedExpenseChip(item);
                              setExpenseData({
                                ...expenseData,
                                category: item,
                              });
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="categories-wrapper">
                        <p>Select division</p>
                        {divisions.map((item) => (
                          <div
                            key={item}
                            className={
                              expenseData.division === item
                                ? "categories-chip selected-chip"
                                : "categories-chip"
                            }
                            onClick={() =>
                              setExpenseData({ ...expenseData, division: item })
                            }
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <br />
                      <Button color="danger" onClick={addExpense}>
                        Add Expense
                      </Button>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>
          </Modal>
        </Container>
      )}
      {loading && (
        <div className="login-container">
          <h1>Loading transactions....please wait....</h1>
        </div>
      )}
    </>
  );
};

export default Dashboard;

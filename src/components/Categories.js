import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Container, Table } from "reactstrap";
import { getTransactions } from "../utils/networkHandler";

const Categories = ({ userID, isLogged }) => {
  const [transactionData, setTransactionData] = useState({
    oneWeekRecord: { transactions: [] },
    oneMonthRecord: { transactions: [] },
    oneYearRecord: { transactions: [] },
  });

  const [selectedType, setSelectedType] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let res = await getTransactions(userID);
      if (res.success) {
        setTransactionData(res);
        console.log("cat", res);
      }
    };
    fetchData();
  }, []);

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

  const types = ["Income", "expense"];

  return (
    <>
      {isLogged && (
        <Container>
          <div className="heading-container text-center">
            <div>
              <h1>Filter by Categories & Division</h1>
              <div>
                <div>
                  {types.map((item) => (
                    <div
                      key={item.date}
                      className={
                        selectedType === item
                          ? "categories-chip selected-chip"
                          : "categories-chip"
                      }
                      onClick={() => {
                        if (item === "Income") {
                          setSelectedDivision("");
                        }
                        setSelectedType(item);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                {selectedType === "expense" && (
                  <>
                    <div>
                      {divisions.map((item) => (
                        <div
                          key={item}
                          className={
                            selectedDivision === item
                              ? "categories-chip selected-chip"
                              : "categories-chip"
                          }
                          onClick={() => setSelectedDivision(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div>
                      {expenseCategoryChips.map((item) => (
                        <div
                          key={item}
                          className={
                            selectedCategory === item
                              ? "categories-chip selected-chip"
                              : "categories-chip"
                          }
                          onClick={() => setSelectedCategory(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {selectedType === "Income" && (
                  <div>
                    {incomeCategoryChips.map((item) => (
                      <div
                        key={item}
                        className={
                          selectedCategory === item
                            ? "categories-chip selected-chip"
                            : "categories-chip"
                        }
                        onClick={() => setSelectedCategory(item)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
              {transactionData.oneWeekRecord.transactions
                .filter(
                  (item) =>
                    item.type === selectedType &&
                    item.division === selectedDivision &&
                    item.category === selectedCategory
                )
                .map((item) => {
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
        </Container>
      )}
      {!isLogged && <Redirect to="/login" />}
    </>
  );
};

export default Categories;

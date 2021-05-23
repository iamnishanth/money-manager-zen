import { useEffect, useState } from "react";
import { Container, Table } from "reactstrap";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { getTransactions } from "../utils/networkHandler";

const DateFilter = ({ userID, isLogged }) => {
  const [value, onChange] = useState([new Date(), new Date()]);
  const [transactionData, setTransactionData] = useState({
    oneWeekRecord: { transactions: [] },
    oneMonthRecord: { transactions: [] },
    oneYearRecord: { transactions: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      let res = await getTransactions(userID);
      console.log(res);
      if (res.success) {
        setTransactionData(res);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <div className="heading-container text-center">
        <div>
          <h1>Filter by Date</h1>
          <div>
            <DateRangePicker
              clearIcon={null}
              format={"dd-MM-y"}
              minDate={new Date("1/1/2000")}
              maxDate={new Date("1/1/2050")}
              onChange={onChange}
              value={value}
            />
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
          {transactionData.oneYearRecord.transactions
            .filter(
              (item) =>
                new Date(item.date) > value[0] && new Date(item.date) < value[1]
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
  );
};

export default DateFilter;

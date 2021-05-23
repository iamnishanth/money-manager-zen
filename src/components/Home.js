import { Redirect } from "react-router";
import { Container } from "reactstrap";
import Dashboard from "./Dashboard";
import Header from "./Header";

const Home = ({ isLogged, userID }) => {
  return (
    <>
      {isLogged && (
        <Container>
          <Header />
          <Dashboard userID={userID} />
        </Container>
      )}
      {!isLogged && <Redirect to="/login" />}
    </>
  );
};

export default Home;

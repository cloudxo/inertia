// @ts-nocheck
import * as React from "react";
import * as mainActions from '../../_actions/main';
import api from '../../api';
import { Containers, Dashboard, Settings } from '../../_pages';

import Footer from '../_old_components/Footer';
import NavBar from '../_old_components/NavBar';
import {Route, Switch} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as PropTypes from 'prop-types';

// hardcode all styles for now, until we flesh out UI
const styles = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
    width: '100%',
  },

  innerContainer: {
    display: 'flex',
    flexFlow: 'row',
    height: '100%',
    width: '100%',
  },

  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '4rem',
    padding: '0 1.5rem',
    borderBottom: '1px solid #c1c1c1',
  },

  main: {
    height: '100%',
    width: '100%',
    overflowY: 'scroll'
  },
};

class MainWrapper extends React.Component {
    /**
     * @param {any} props
     */
    constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.state = { status: {} };
  }

  async componentDidMount() {
    try {
      const status = await api.getRemoteStatus();
      this.setState({ status });
    } catch (e) {
      console.error(e);
    }
  }

  async handleLogout() {
    const { history } = this.props;
    const response = await api.logout();
    // @ts-ignore
      if (response.status !== 200) {
      // TODO: Log Error
      return;
    }
    history.push('/login');
  }

  render() {
    const { match: { url } } = this.props;
    const { status = {} } = this.state;
    console.log({ status });
      return (
      <div style={styles.container}>
        <NavBar url={url} />

        <div style={styles.innerContainer}>
          <div style={styles.main}>
            <Switch>
              <Route
                exact
                path={`${url}/dashboard`}
                component={() => <Dashboard />}
              />
              <Route
                exact
                path={`${url}/containers`}
                component={() => <Containers dateUpdated="2018-01-01 00:00" />}
              />
              <Route
                exact
                path={`${url}/settings`}
                component={() => <Settings />}
              />
            </Switch>
          </div>
        </div>

        <Footer version={status.version} />
      </div>
    );
  }
}
MainWrapper.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
};

// @ts-ignore
const mapStateToProps = ({ Main }) => ({ status: Main.status });

// @ts-ignore
const mapDispatchToProps = dispatch => bindActionCreators({ ...mainActions }, dispatch);

const Main = connect(mapStateToProps, mapDispatchToProps)(MainWrapper);


export default Main;

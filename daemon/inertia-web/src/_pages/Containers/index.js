// @ts-nocheck
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TerminalView from '../../components/_old_components/TerminalView';
import IconHeader from '../../components/_old_components/IconHeader';
import Status from '../../components/_old_components/Status';

import './index.scss';

const mocklogs = [
  'log1asdasdasdasdasdasdasdssdasdasdssdasdasdssdasdasdssdasdasdsa',
];

class ContainersWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dateUpdated } = this.props;
    return (
      <div className="container pad-sides-s">
        <IconHeader type="containers" title="/inertia-deploy-test_dev_1" />
        <div className="container-info">
          <Status title="Status:" status="Active" />
          <h3 className="pad-left-s">
Last Updated:
          </h3>
          <h4 className="pad-bottom-xs">
            {dateUpdated}
          </h4>
        </div>
        <div className="terminalview jc-center flex-dir-col">
          <TerminalView logs={mocklogs} />
        </div>
      </div>
    );
  }
}
ContainersWrapper.propTypes = {
  dateUpdated: PropTypes.string,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const Containers = connect(mapStateToProps, mapDispatchToProps)(ContainersWrapper);

export default Containers;

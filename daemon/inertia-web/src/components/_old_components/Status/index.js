// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Status = ({ title, status }) => (
  <div className="badge color-grey">
    <h3 className="title">
      {title}
    </h3>
    <div className="badge badge-pill-active">
      {status}
    </div>
  </div>
);

Status.propTypes = {
  status: PropTypes.string,
  title: PropTypes.string,
};

export default Status;

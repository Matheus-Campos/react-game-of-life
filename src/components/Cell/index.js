import React from 'react';
import PropTypes from 'prop-types';

export default function Cell({ active, handleClick }) {
  return (
    <button
      className="cell"
      style={{
        backgroundColor: active && 'yellow'
      }}
      onClick={handleClick}
      type="button"
    />
  );
}

Cell.propTypes = {
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

import React from "react"
import PropTypes from "prop-types"

class Main extends React.Component {
  render () {
    return (
      <React.Fragment>
        Message: {this.props.message}
      </React.Fragment>
    );
  }
}

Main.propTypes = {
  message: PropTypes.string
};
export default Main

import React from "react";
import { Link } from "react-router-dom";

class Assets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: []
    };
  }

  componentDidMount() {
    const url = "/api/v1/assets/index";
    fetch(url)
    .then(response => {
        if (response.ok) {
        return response.json();
        }
        throw new Error("Network response was not ok.");
    })
    .then(response => this.setState({ assets: response }))
    .catch(() => this.props.history.push("/"));
  }

  handleDelete(name, id) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const url = `/api/v1/assets/destroy/${id}`;
      const token = document.querySelector('meta[name="csrf-token"]').content;

      fetch(url, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        }
      })

      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => location.reload())
      .catch(error => console.log(error.message));
    }
  }

  render() {
    const { assets } = this.state;
    const allAssets = assets.map((asset, index) => (
      <tr>
          <td>{asset.ticker}</td>
          <td>{asset.cost}</td>
          <td><button onClick={this.handleDelete.bind(this, asset.ticker, asset.id)}>Delete</button></td>
      </tr>
    ));

    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-5">
            <h1 className="display-4">All assets</h1>
            <p className="lead text-muted">
              Filler lead text-muted
            </p>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
            <div className="text-right mb-3">
              <Link to="/addasset" className="btn custom-button">
                Add New Asset
              </Link>
            </div>
            <tr>
                <th>Ticker</th>
                <th>Cost</th>
                <th>Actions</th>
            </tr>
              {allAssets}
            
            <Link to="/" className="btn btn-link">
              Home
            </Link>
          </main>
        </div>
      </>
    );
  }

}
export default Assets;
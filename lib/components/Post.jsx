import React from 'react'
import PostActions from '../actions/PostActions'

var Post = React.createClass({

  render() {
    return (
      <h3 onClick={this._onClick}>{this.props.text}</h3>
    )
  },

  _onClick() {
    PostActions.destroy(this.props.id);
  }

})

export default Post

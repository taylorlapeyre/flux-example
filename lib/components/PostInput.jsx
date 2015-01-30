import React from 'react'
import PostActions from '../actions/PostActions'

var PostInput = React.createClass({

  render() {
    return (
      <input type="text"
             onBlur={this._save}
             onChange={this._onChange} />
    );
  },

  _save() {
    PostActions.create(this.state.text);
  },

  _onChange(e) {
    this.setState({ text: e.target.value })
  }

})

export default PostInput

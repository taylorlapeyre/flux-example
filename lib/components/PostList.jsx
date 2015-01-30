import React from 'react'
import Post from './Post.jsx!'
import PostStore from '../stores/PostStore'

var PostList = React.createClass({

  getInitialState() {
    return {posts: PostStore.getAll()}
  },

  componentDidMount() {
    PostStore.addChangeListener(this._onChange);
  },

  render() {
    var posts = [];
    for (var key in this.state.posts) {
      let text = this.state.posts[key].text;
      posts.push(<Post text={text} id={key} />)
    }

    return <div className="post-list">{posts}</div>
  },

  _onChange() {
    this.setState(PostStore.getAll());
  }

})

export default PostList

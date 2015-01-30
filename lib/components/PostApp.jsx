import React from 'react'
import Post from './Post.jsx!'
import PostList from './PostList.jsx!'
import PostInput from './PostInput.jsx!'

var PostApp = React.createClass({

  render() {
    return (
      <div>
        <PostInput />
        <h1>Posts</h1>
        <PostList />
      </div>
    )
  }

})

export default PostApp

import Dispatcher from '../dispatcher/AppDispatcher'
import PostConstants from '../constants/PostConstants'
import events from 'nodelibs/events'

let EventEmitter = events.EventEmitter
let CHANGE_EVENT = "change";
var _posts = {
  1: {
    text: "Hello"
  }
};

var PostStore = Object.assign({}, EventEmitter.prototype, {

  getAll() {
    return _posts;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});


Dispatcher.register(action => {
  var text;

  switch (action.actionType) {

    case PostConstants.POST_CREATE:
      text = action.text.trim();
      if (text !== '') {
        console.log("Creating post with text", text);
        var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        _posts[id] = {
          id: id,
          complete: false,
          text: text
        };
      }
      PostStore.emitChange();
      break;

    case PostConstants.POST_UPDATE:
      text = action.text.trim();
      if (text !== '') {
        console.log("Updating post with id", action.id);
        console.log("With updates", action.updates);
        Object.assign({}, _posts[action.id], action.updates);
      }
      PostStore.emitChange();
      break;

    case PostConstants.POST_DESTROY:
      console.log("Destroying post with id", action.id);
      delete _posts[action.id];
      PostStore.emitChange();
      break;

    default:
      // no op
  }
});


export default PostStore

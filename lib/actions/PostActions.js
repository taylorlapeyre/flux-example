import Dispatcher from '../dispatcher/AppDispatcher'
import Constants  from '../constants/PostConstants'

export default {

  create(text) {
    Dispatcher.dispatch({
      actionType: Constants.POST_CREATE,
      text: text
    });
  },

  update(id, updates) {
    Dispatcher.dispatch({
      actionType: Constants.POST_UPDATE,
      id: id,
      updates: updates
    });
  },

  destroy(id) {
    Dispatcher.dispatch({
      actionType: Constants.POST_DESTROY,
      id: id
    });
  }
}

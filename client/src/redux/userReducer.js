const userReducer = (state, action) =>{
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        email: action.email
      };
    default:
      return state
  }
};

export default userReducer;
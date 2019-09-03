export default {
  state: {
    company: {
      email: '',
    },
    options: {
      card: 0,
      cash: 0,
      isCard: false,
      skip: false,
    },
    user: {},
  },
  mutations: {
    SET_COMPANY(state, company) {
      state.company = company;
    },
    SET_OPTIONS(state, options) {
      state.options = options;
    },
    SET_USER(state, user) {
      state.user = user;
    },
  },
  actions: {},
};

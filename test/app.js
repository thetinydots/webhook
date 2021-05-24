const webhook = require("../dist").default;

webhook(
  [
    {
      path: "/test",
      action: () => {
        return "hello from webhook";
      },
    },
    {
      path: "/test/post",
      type: "POST",
      action: (data) => {
        return {
          msg: "hello from webhook post",
          data,
        };
      },
    },
    {
      path: "/test/:id",
      action: (_, params) => {
        return {
          msg: "hello from webhook",
          params,
        };
      },
    },
    {
      path: "/query",
      action: (data, params, query) => {
        return {
          msg: "hello from webhook",
          query,
        };
      },
    },
  ],
  3010,
  true
);

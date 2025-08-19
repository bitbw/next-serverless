export const getErrorNoticeCard = (data: {
  title: string;
  datetime: string;
  env: string;
  url: string;
  web_url: string;
}) => {
  const { title, datetime, env, url, web_url } = data;
  return {
    config: {
      update_multi: true,
    },
    card_link: {
      url: "",
    },
    i18n_elements: {
      zh_cn: [
        {
          tag: "column_set",
          horizontal_spacing: "8px",
          horizontal_align: "left",
          columns: [
            {
              tag: "column",
              width: "weighted",
              elements: [
                {
                  tag: "markdown",
                  content: `**🕐 时间：**${datetime}`,
                  text_align: "left",
                  text_size: "normal",
                },
              ],
              vertical_align: "top",
              vertical_spacing: "8px",
              weight: 1,
            },
          ],
          margin: "16px 0px 0px 0px",
        },
        {
          tag: "markdown",
          content: `**🔢环境：** ${env}`,
          text_align: "left",
          text_size: "normal",
        },
        {
          tag: "column_set",
          flex_mode: "stretch",
          horizontal_spacing: "8px",
          horizontal_align: "left",
          columns: [
            {
              tag: "column",
              width: "weighted",
              elements: [
                {
                  tag: "markdown",
                  content: `**🗳报错URL：**${url}`,
                  text_align: "left",
                  text_size: "normal",
                },
              ],
              vertical_align: "top",
              vertical_spacing: "8px",
              weight: 1,
            },
          ],
          margin: "16px 0px 0px 0px",
        },
        {
          tag: "markdown",
          content: `**📝信息：**${title}`,
          text_align: "left",
          text_size: "normal",
        },
        {
          tag: "action",
          actions: [
            {
              tag: "button",
              text: {
                tag: "plain_text",
                content: "跟进处理",
              },
              type: "primary",
              width: "default",
              size: "small",
              icon: {
                tag: "standard_icon",
                token: "team-code_outlined",
              },
              behaviors: [
                {
                  type: "open_url",
                  default_url: web_url,
                  pc_url: "",
                  ios_url: "",
                  android_url: "",
                },
              ],
            },
          ],
        },
      ],
    },
    i18n_header: {
      zh_cn: {
        title: {
          tag: "plain_text",
          content: `收到报错信息: ${title} `,
        },
        subtitle: {
          tag: "plain_text",
          content: "",
        },
        template: "red",
        ud_icon: {
          tag: "standard_icon",
          token: "warn-report_outlined",
        },
      },
    },
  };
};

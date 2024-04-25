import { input, button } from "@eofol/eofol-simple";
import { sy, sx, defineBuiltinElement, cx } from "@eofol/eofol";
import { div, flex, h2, theme } from "../extract";

type Option = { title: string; id: string };

type SelectOptions = ({ group: string; options: Option[] } | Option)[];

type SelectSearchProps = {
  options: SelectOptions;
  value: string;
  defaultOptions: SelectOptions;
};

type DefineSelectSearchProps = { options: SelectOptions };

sy(
  {
    position: "relative",
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    backgroundColor: "#121212",
    overflow: "auto",
    height: "400px",
    padding: `${theme.spacing.space1} 0`,
    width: "475px",
  },
  "search-select-menu"
);

const searchSelectMenu = (children: Element[]) =>
  div("search-select-menu", children);

sy(
  {
    color: theme.color.secondary,
    cursor: "pointer",
    padding: `2px 0 2px ${theme.spacing.space4}`,
  },
  "search-select-menu-item-base"
);

const searchSelectMenuItem = (item: Option) =>
  div(
    [
      "search-select-menu-item-base",
      sx(
        {
          backgroundColor: theme.color.secondaryDarker,
          color: "#000000",
          fontWeight: 700,
        },
        "hover"
      ),
    ],
    item.title
  );

sy(
  { padding: `${theme.spacing.space1} ${theme.spacing.space2}` },
  "select-search-opt-group"
);

const searchSelectOptGroup = (group: string) =>
  div("select-search-opt-group", group);

sy({ display: "none", position: "absolute" }, "select-search-menu-inactive");

sy({ display: "block", position: "absolute" }, "select-search-menu-active");

const searchSelect = (
  { options, value, defaultOptions }: SelectSearchProps,
  setState: any
) => {
  const openMenu = () => {
    const menuElement = document.getElementById("select-search-menu");
    if (menuElement) {
      menuElement.className = "select-search-menu-active";
    }
  };

  const closeMenu = () => {
    const menuElement = document.getElementById("select-search-menu");
    if (menuElement) {
      menuElement.className = "select-search-menu-inactive";
    }
  };

  const filterOptions = (pattern: string) => {
    // @ts-ignore
    const result = defaultOptions
      // @ts-ignore
      .map((option) => {
        // @ts-ignore
        if (option.group) {
          // @ts-ignore
          const result = option.options.filter(
            // @ts-ignore
            (item) =>
              !pattern ||
              item.title.toLowerCase().includes(pattern.toLowerCase())
          );
          if (result.length > 0) {
            return {
              ...option,
              // @ts-ignore
              options: result,
            };
          } else {
            return false;
          }
        } else {
          return (
            !pattern || // @ts-ignore
            option.title.toLowerCase().includes(pattern.toLowerCase())
          );
        }
      })
      .filter(Boolean);

    // @ts-ignore
    setState({
      // @ts-ignore
      defaultOptions,
      value: pattern,
      options: result,
    });
  };

  const searchSelectInputElement = input({
    value,
    name: "select-search-preset-scale",
    onInput: (nextVal) => {
      filterOptions(nextVal);
    },
    onChange: () => {},
    classname: sx({
      backgroundColor: "#121212",
      height: "30px",
      width: "400px",
    }),
  });
  searchSelectInputElement.onmouseover = () => {
    openMenu();
  };

  return div(
    undefined,
    [
      flex({ alignItems: "center" }, [
        searchSelectInputElement,
        button({
          onClick: () => {
            openMenu();
          },
          children: "Open",
          styles: cx(
            sx({
              height: "36px",
              color: theme.color.secondary,
              border: `1px solid ${theme.color.secondary}`,
            }),
            sx(
              {
                backgroundColor: theme.color.secondaryDark,
                color: "#000000",
                border: `1px solid ${theme.color.secondary}`,
              },
              "hover"
            )
          ),
        }),
      ]),
      div(
        "select-search-menu-inactive",
        searchSelectMenu(
          options.length > 0
            ? options
                .map((option) =>
                  // @ts-ignore
                  option.group
                    ? [
                        // @ts-ignore
                        searchSelectOptGroup(option.group),
                        // @ts-ignore
                        ...option.options.map((item) =>
                          searchSelectMenuItem(item)
                        ),
                      ] // @ts-ignore
                    : searchSelectMenuItem(option)
                )
                .flat()
            : [
                div(
                  sx({
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }),
                  h2("No results")
                ),
              ]
        ),
        { id: "select-search-menu" }
      ),
    ],
    {},
    {
      onmouseleave: () => {
        closeMenu();
      },
    }
  );
};

export const defineSelectSearch = ({ options }: DefineSelectSearchProps) => {
  defineBuiltinElement<SelectSearchProps>({
    tagName: "select-search",
    initialState: { options, value: "", defaultOptions: options },
    render: (state, setState) => {
      // @ts-ignore
      return searchSelect(state, setState);
    },
    effect: (state) => {
      const inputElement = document.getElementById(
        "select-search-preset-scale"
      );
      if (inputElement) {
        inputElement.focus();
        // @ts-ignore
        inputElement.value = "";
        // @ts-ignore
        inputElement.value = state.value;
      }
    },
  });
};

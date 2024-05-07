import { input, button, div, flex } from "@eofol/eofol-simple";
import {
  sy,
  sx,
  defineBuiltinElement,
  cx,
  selector,
  getTheme,
} from "@eofol/eofol";
import { h2 } from "../extract";
import { scalePresetsFlat } from "../data";

type Option = { title: string; id: string };

type SelectOptions = ({ group: string; options: Option[] } | Option)[];

type SelectSearchProps = {
  options: SelectOptions;
  value: string;
  defaultOptions: SelectOptions;
  onChange: undefined | ((nextVal: string) => void);
  inputElementId: string;
};

type DefineSelectSearchProps = {
  options: SelectOptions;
  storeName: string;
  tagName: string;
  inputElementId: string;
};

const searchSelectMenu = (children: Element[]) => {
  const theme = getTheme();

  return div(
    sx({
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
    }),
    children
  );
};

const searchSelectMenuItem = (
  item: Option,
  onChange: any,
  state: any,
  setState: any
) => {
  const theme = getTheme();

  return div(
    [
      sx({
        color: theme.color.secondary,
        cursor: "pointer",
        padding: `2px 0 2px ${theme.spacing.space4}`,
      }),
      sx(
        {
          backgroundColor: theme.color.secondaryDarker,
          color: "#000000",
          fontWeight: 700,
        },
        ":hover"
      ),
    ],
    item.title,
    {},
    {
      onclick: () => {
        if (onChange) {
          onChange(item.id);
          setState({
            ...state,
            value: scalePresetsFlat.find((s) => s.id === item.id)?.title,
          });
        }
      },
    }
  );
};

const searchSelectOptGroup = (group: string) => {
  const theme = getTheme();

  return div(
    sx({ padding: `${theme.spacing.space1} ${theme.spacing.space2}` }),
    group
  );
};

sy({ position: "absolute" }, "select-search-menu-base");

sy({ display: "none" }, "select-search-menu-inactive");

sy({ display: "block" }, "select-search-menu-active");

sy(
  {
    backgroundColor: "#121212",
    height: "30px",
    width: "400px",
  },
  "select-search-input-base"
);

const searchSelect = (
  {
    options,
    value,
    defaultOptions,
    onChange,
    inputElementId,
  }: SelectSearchProps,
  setState: any
) => {
  const theme = getTheme();

  const state = { options, value, defaultOptions, onChange };

  const openMenu = () => {
    const menuElement = document.getElementById("select-search-menu");
    if (menuElement) {
      menuElement.className =
        "select-search-menu-base select-search-menu-active";
    }
  };

  const closeMenu = () => {
    const menuElement = document.getElementById("select-search-menu");
    if (menuElement) {
      menuElement.className =
        "select-search-menu-base select-search-menu-inactive";
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
    name: inputElementId,
    onInput: (nextVal) => {
      filterOptions(nextVal);
    },
    onChange: () => {},
    classname: "select-search-input-base",
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
              ":hover"
            )
          ),
        }),
      ]),
      div(
        "select-search-menu-base select-search-menu-inactive",
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
                          searchSelectMenuItem(item, onChange, state, setState)
                        ),
                      ] // @ts-ignore
                    : searchSelectMenuItem(option, onChange, state, setState)
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

const defineSelectSearch = ({
  options,
  storeName,
  tagName,
  inputElementId,
}: DefineSelectSearchProps) => {
  defineBuiltinElement<SelectSearchProps>({
    tagName,
    initialState: { options, value: "", defaultOptions: options },
    subscribe: [storeName],
    render: (state, setState) => {
      const data = selector(storeName);
      return searchSelect(
        // @ts-ignore
        { ...state, onChange: data.onChange, inputElementId },
        setState
      );
    },
    effect: (state) => {
      const inputElement = document.getElementById(inputElementId);
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

export const defineSelectSearchScalePreset = ({
  options,
}: {
  options: SelectOptions;
}) => {
  defineSelectSearch({
    tagName: "select-search",
    options,
    storeName: "select-search-preset",
    inputElementId: "select-search-preset-scale",
  });
};

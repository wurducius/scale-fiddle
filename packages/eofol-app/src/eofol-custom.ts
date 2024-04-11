import { createElement } from "@eofol/eofol";

export const createCustomElementByClass = (
  CustomClass: CustomElementConstructor,
  classname?: string,
  children?: Element | Element[] | string | string[] | undefined,
  attributes?: Record<string, string>,
  properties?: Record<string, string>
) => {
  const customElement = new CustomClass();

  if (classname) {
    if (Array.isArray(classname)) {
      classname.reduce((acc, next) => `${acc} ${next}`, "");
    } else {
      customElement.setAttribute("class", classname);
    }
  }

  if (attributes) {
    Object.keys(attributes).forEach((attributeName) => {
      customElement.setAttribute(attributeName, attributes[attributeName]);
    });
  }

  if (properties) {
    Object.keys(properties).forEach((propertyName) => {
      // @ts-ignore
      customElement[propertyName] = properties[propertyName];
    });
  }

  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        customElement.append(child);
      });
    } else {
      customElement.append(children);
    }
  }

  return customElement;
};

export const createCustomElement = (
  tagName: string,
  classname?: string,
  children?: Element | Element[] | string | string[] | undefined,
  attributes?: Record<string, string>,
  properties?: Record<string, string>
) => {
  const CustomClass = customElements.get(tagName);

  if (CustomClass) {
    return createCustomElementByClass(
      CustomClass,
      classname,
      children,
      attributes,
      properties
    );
  } else {
    return "No definition found for custom element " + tagName;
  }
};

export const e = (
  tagName: string,
  classname?: string,
  children?: Element | Element[] | string | string[] | undefined,
  attributes?: Record<string, string>,
  properties?: Record<string, string>
) => {
  const CustomClass = customElements.get(tagName);

  if (CustomClass) {
    return createCustomElementByClass(
      CustomClass,
      classname,
      children,
      attributes,
      properties
    );
  } else {
    return createElement(tagName, classname, children, attributes, properties);
  }
};
